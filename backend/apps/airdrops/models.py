# ── models.py ─────────────────────────────────────────────────────────────────
from django.db import models
import uuid


class Airdrop(models.Model):
    class Status(models.TextChoices):
        UPCOMING = "upcoming", "Sắp diễn ra"
        ACTIVE = "active", "Đang diễn ra"
        ENDED = "ended", "Đã kết thúc"

    class Type(models.TextChoices):
        FREE = "free", "Free Airdrop"
        TASK = "task", "Task-based"
        HOLDER = "holder", "Holder Airdrop"
        TESTNET = "testnet", "Testnet"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    slug = models.SlugField(max_length=300, unique=True)

    # ── Info ──────────────────────────────────────────
    name = models.CharField(max_length=200)
    logo = models.URLField(blank=True)
    website = models.URLField(blank=True)
    description = models.TextField(blank=True)
    description_vi = models.TextField(blank=True)

    # ── Token ─────────────────────────────────────────
    token_symbol = models.CharField(max_length=20, blank=True)
    total_allocation = models.CharField(max_length=100, blank=True)  # vd: "5,000,000 USDT"
    estimated_value = models.DecimalField(max_digits=20, decimal_places=2, null=True, blank=True)

    # ── Requirements ──────────────────────────────────
    airdrop_type = models.CharField(max_length=20, choices=Type.choices, default=Type.TASK)
    requirements = models.JSONField(default=list)  # ["Follow Twitter", "Join Telegram", ...]
    guide_url = models.URLField(blank=True)

    # ── Status & Timing ───────────────────────────────
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.UPCOMING)
    start_date = models.DateTimeField(null=True, blank=True)
    end_date = models.DateTimeField(null=True, blank=True)

    # ── Social ────────────────────────────────────────
    twitter_url = models.URLField(blank=True)
    telegram_url = models.URLField(blank=True)
    discord_url = models.URLField(blank=True)

    # ── Metadata ──────────────────────────────────────
    is_featured = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)
    view_count = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-is_featured", "-created_at"]
        indexes = [
            models.Index(fields=["status"]),
            models.Index(fields=["airdrop_type", "status"]),
        ]

    def __str__(self):
        return self.name
