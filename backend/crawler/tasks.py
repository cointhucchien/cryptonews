from celery import shared_task
import feedparser
import httpx
import logging
from django.utils import timezone
from django.utils.text import slugify
from datetime import datetime
import uuid

logger = logging.getLogger(__name__)

RSS_SOURCES = [
    {
        "name": "CoinDesk",
        "rss_url": "https://www.coindesk.com/arc/outboundfeeds/rss/",
        "website": "https://www.coindesk.com",
        "language": "en",
    },
    {
        "name": "Decrypt",
        "rss_url": "https://decrypt.co/feed",
        "website": "https://decrypt.co",
        "language": "en",
    },
    {
        "name": "CryptoSlate",
        "rss_url": "https://cryptoslate.com/feed/",
        "website": "https://cryptoslate.com",
        "language": "en",
    },
    {
        "name": "The Block",
        "rss_url": "https://www.theblock.co/rss.xml",
        "website": "https://www.theblock.co",
        "language": "en",
    },
    {
        "name": "Cointelegraph",
        "rss_url": "https://cointelegraph.com/rss",
        "website": "https://cointelegraph.com",
        "language": "en",
    },
]


@shared_task
def crawl_all_feeds():
    """Crawl tất cả RSS feeds và lưu vào DB"""
    for source_config in RSS_SOURCES:
        crawl_single_feed.delay(source_config)
    logger.info(f"Dispatched {len(RSS_SOURCES)} feed crawl tasks")


@shared_task(bind=True, max_retries=3)
def crawl_single_feed(self, source_config: dict):
    """Crawl 1 RSS feed"""
    from apps.news.models import Article, NewsSource, Category

    source_name = source_config["name"]

    try:
        # Lấy hoặc tạo NewsSource
        source, _ = NewsSource.objects.get_or_create(
            website=source_config["website"],
            defaults={
                "name": source_name,
                "rss_url": source_config["rss_url"],
                "language": source_config["language"],
            },
        )

        # Parse RSS
        feed = feedparser.parse(source_config["rss_url"])
        new_count = 0

        # Lấy category mặc định
        default_category, _ = Category.objects.get_or_create(
            slug="general",
            defaults={"name": "General", "icon": "📰"},
        )

        for entry in feed.entries[:20]:  # Lấy tối đa 20 bài mới nhất mỗi feed
            original_url = entry.get("link", "")
            if not original_url:
                continue

            # Skip nếu đã tồn tại
            if Article.objects.filter(original_url=original_url).exists():
                continue

            # Parse published date
            published_at = timezone.now()
            if hasattr(entry, "published_parsed") and entry.published_parsed:
                try:
                    published_at = timezone.make_aware(
                        datetime(*entry.published_parsed[:6])
                    )
                except Exception:
                    pass

            title = entry.get("title", "")[:500]
            base_slug = slugify(title)[:280] or str(uuid.uuid4())[:8]

            # Tránh slug trùng
            slug = base_slug
            counter = 1
            while Article.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1

            # Lấy thumbnail từ media_content hoặc enclosures
            thumbnail = ""
            if hasattr(entry, "media_content") and entry.media_content:
                thumbnail = entry.media_content[0].get("url", "")
            elif hasattr(entry, "enclosures") and entry.enclosures:
                thumbnail = entry.enclosures[0].get("href", "")

            content = entry.get("content", [{}])[0].get("value", "") or entry.get("summary", "")

            article = Article.objects.create(
                slug=slug,
                title=title,
                content=content[:50000],
                thumbnail=thumbnail,
                original_url=original_url,
                source=source,
                category=default_category,
                language=source_config["language"],
                published_at=published_at,
                status=Article.Status.PUBLISHED,
            )

            # Queue AI summarize task
            from apps.news.tasks import summarize_article
            summarize_article.apply_async(
                args=[str(article.id)],
                countdown=30,  # delay 30 giây để tránh rate limit
            )
            new_count += 1

        # Cập nhật last_crawled_at
        source.last_crawled_at = timezone.now()
        source.save(update_fields=["last_crawled_at"])

        logger.info(f"[{source_name}] Crawled {new_count} new articles")

    except Exception as exc:
        logger.error(f"[{source_name}] Crawl error: {exc}")
        raise self.retry(exc=exc, countdown=60)
