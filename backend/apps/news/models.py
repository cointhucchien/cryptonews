from django.db import models
from django.utils.text import slugify
from django.utils.translation import gettext_lazy as _
import uuid


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True)   # emoji hoặc icon class
    order = models.PositiveSmallIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name_plural = "categories"
        ordering = ["order", "name"]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(unique=True)

    def __str__(self):
        return self.name


class NewsSource(models.Model):
    """Nguồn tin — RSS feed hoặc website được crawl"""
    name = models.CharField(max_length=200)
    website = models.URLField()
    rss_url = models.URLField(blank=True)
    logo = models.URLField(blank=True)
    language = models.CharField(max_length=10, default="en")
    is_active = models.BooleanField(default=True)
    crawl_interval_minutes = models.PositiveSmallIntegerField(default=15)
    last_crawled_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class Article(models.Model):
    class Status(models.TextChoices):
        DRAFT = "draft", _("Bản nháp")
        PUBLISHED = "published", _("Đã xuất bản")
        ARCHIVED = "archived", _("Lưu trữ")

    class Language(models.TextChoices):
        VI = "vi", _("Tiếng Việt")
        EN = "en", _("English")

    # ── Identity ──────────────────────────────────────
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    slug = models.SlugField(max_length=300, unique=True)

    # ── Content ───────────────────────────────────────
    title = models.CharField(max_length=500)
    title_vi = models.CharField(max_length=500, blank=True)   # bản dịch tiếng Việt
    summary = models.TextField(blank=True)                     # tóm tắt bằng AI
    summary_vi = models.TextField(blank=True)
    content = models.TextField(blank=True)
    thumbnail = models.URLField(blank=True)

    # ── Relations ─────────────────────────────────────
    source = models.ForeignKey(
        NewsSource, on_delete=models.SET_NULL, null=True, related_name="articles"
    )
    original_url = models.URLField(unique=True)
    category = models.ForeignKey(
        Category, on_delete=models.SET_NULL, null=True, related_name="articles"
    )
    tags = models.ManyToManyField(Tag, blank=True, related_name="articles")

    # ── AI Metadata ───────────────────────────────────
    ai_summarized = models.BooleanField(default=False)
    ai_translated = models.BooleanField(default=False)
    ai_tags_generated = models.BooleanField(default=False)
    sentiment = models.CharField(
        max_length=10,
        choices=[("bullish", "Bullish"), ("bearish", "Bearish"), ("neutral", "Neutral")],
        blank=True,
    )

    # ── Stats ─────────────────────────────────────────
    view_count = models.PositiveIntegerField(default=0)
    language = models.CharField(max_length=5, choices=Language.choices, default=Language.EN)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PUBLISHED)

    # ── Timestamps ────────────────────────────────────
    published_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-published_at"]
        indexes = [
            models.Index(fields=["-published_at"]),
            models.Index(fields=["status", "-published_at"]),
            models.Index(fields=["category", "-published_at"]),
        ]

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)[:280]
        super().save(*args, **kwargs)
