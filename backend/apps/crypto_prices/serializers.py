# serializers.py
from rest_framework import serializers
from .models import CryptoPrice


class CryptoPriceSerializer(serializers.ModelSerializer):
    class Meta:
        model = CryptoPrice
        fields = [
            "coin_id", "symbol", "name", "logo", "rank",
            "price_usd", "market_cap", "volume_24h",
            "change_1h", "change_24h", "change_7d", "ath",
            "updated_at",
        ]
