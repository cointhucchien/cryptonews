from celery import shared_task
from django.utils import timezone
from datetime import timedelta
import logging

logger = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=3)
def summarize_article(self, article_id: str):
    """Dùng Claude API để tóm tắt + dịch 1 bài — skip nếu không có API key"""
    from django.conf import settings

    # Skip nếu không có API key — không crash
    if not settings.ANTHROPIC_API_KEY:
        logger.info(f"ANTHROPIC_API_KEY not set, skipping AI summarize for {article_id}")
        return

    from .models import Article
    import anthropic
    import json

    try:
        article = Article.objects.get(id=article_id, ai_summarized=False)
    except Article.DoesNotExist:
        return

    client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)

    prompt = f"""Bạn là biên tập viên tin tức crypto chuyên nghiệp.

Bài viết gốc (tiếng Anh):
Title: {article.title}
Content: {article.content[:3000]}

Hãy trả về JSON với format:
{{
  "summary_en": "tóm tắt 2-3 câu bằng tiếng Anh",
  "title_vi": "tiêu đề dịch tiếng Việt",
  "summary_vi": "tóm tắt 2-3 câu bằng tiếng Việt",
  "sentiment": "bullish|bearish|neutral",
  "tags": ["tag1", "tag2", "tag3"]
}}

Chỉ trả về JSON, không giải thích thêm."""

    try:
        response = client.messages.create(
            model="claude-opus-4-5",
            max_tokens=1000,
            messages=[{"role": "user", "content": prompt}],
        )
        data = json.loads(response.content[0].text)

        article.summary = data.get("summary_en", "")
        article.title_vi = data.get("title_vi", "")
        article.summary_vi = data.get("summary_vi", "")
        article.sentiment = data.get("sentiment", "neutral")
        article.ai_summarized = True
        article.ai_translated = True
        article.save()

        from .models import Tag
        for tag_name in data.get("tags", [])[:5]:
            tag, _ = Tag.objects.get_or_create(
                slug=tag_name.lower().replace(" ", "-"),
                defaults={"name": tag_name},
            )
            article.tags.add(tag)

        article.ai_tags_generated = True
        article.save(update_fields=["ai_tags_generated"])
        logger.info(f"AI summarized: {article.slug}")

    except Exception as exc:
        logger.error(f"AI summarize failed for {article_id}: {exc}")
        raise self.retry(exc=exc, countdown=60 * 5)


@shared_task
def summarize_pending_articles():
    """Skip hoàn toàn nếu không có API key"""
    from django.conf import settings
    if not settings.ANTHROPIC_API_KEY:
        logger.info("ANTHROPIC_API_KEY not set, skipping batch summarize")
        return

    from .models import Article
    pending = Article.objects.filter(
        ai_summarized=False,
        status=Article.Status.PUBLISHED,
    ).values_list("id", flat=True)[:50]

    for article_id in pending:
        summarize_article.delay(str(article_id))

    logger.info(f"Queued {len(pending)} articles for AI summarization")


@shared_task
def cleanup_old_articles():
    from .models import Article
    cutoff = timezone.now() - timedelta(days=90)
    deleted, _ = Article.objects.filter(
        published_at__lt=cutoff,
        status=Article.Status.ARCHIVED,
    ).delete()
    logger.info(f"Cleaned up {deleted} old articles")
