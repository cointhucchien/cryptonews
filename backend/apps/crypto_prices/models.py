# models.py
from django.db import models


class CryptoPrice(models.Model):
    coin_id = models.CharField(max_length=100, unique=True)   # coingecko id: "bitcoin"
    symbol = models.CharField(max_length=20)                   # "BTC"
    name = models.CharField(max_length=100)                    # "Bitcoin"
    logo = models.URLField(blank=True)

    # ── Price Data ────────────────────────────────────
    price_usd = models.DecimalField(max_digits=30, decimal_places=8)
    market_cap = models.DecimalField(max_digits=30, decimal_places=2, null=True)
    volume_24h = models.DecimalField(max_digits=30, decimal_places=2, null=True)
    change_1h = models.DecimalField(max_digits=10, decimal_places=4, null=True)
    change_24h = models.DecimalField(max_digits=10, decimal_places=4, null=True)
    change_7d = models.DecimalField(max_digits=10, decimal_places=4, null=True)
    ath = models.DecimalField(max_digits=30, decimal_places=8, null=True)
    rank = models.PositiveIntegerField(null=True)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["rank"]
        indexes = [models.Index(fields=["symbol"]), models.Index(fields=["rank"])]

    def __str__(self):
        return f"{self.symbol} — ${self.price_usd}"
