import os
from celery import Celery
from celery.schedules import crontab

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

app = Celery("cryptonews")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()

# ── Periodic Tasks ────────────────────────────────────
app.conf.beat_schedule = {
    "crawl-news-feeds": {
        "task": "crawler.tasks.crawl_all_feeds",
        "schedule": crontab(minute="*/15"),
    },
    "update-crypto-prices": {
        "task": "apps.crypto_prices.tasks.update_prices",
        "schedule": crontab(minute="*/2"),
    },
    "ai-summarize-pending": {
        "task": "apps.news.tasks.summarize_pending_articles",
        "schedule": crontab(minute="*/30"),
    },
    "cleanup-old-articles": {
        "task": "apps.news.tasks.cleanup_old_articles",
        "schedule": crontab(hour=2, minute=0),
    },
}
