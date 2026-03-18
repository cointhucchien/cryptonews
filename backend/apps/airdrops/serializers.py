# serializers.py
from rest_framework import serializers
from .models import Airdrop


class AirdropSerializer(serializers.ModelSerializer):
    time_remaining = serializers.SerializerMethodField()

    class Meta:
        model = Airdrop
        fields = [
            "id", "slug", "name", "logo", "website", "description", "description_vi",
            "token_symbol", "total_allocation", "estimated_value",
            "airdrop_type", "requirements", "guide_url",
            "status", "start_date", "end_date", "time_remaining",
            "twitter_url", "telegram_url", "discord_url",
            "is_featured", "is_verified", "view_count",
        ]

    def get_time_remaining(self, obj):
        from django.utils import timezone
        if obj.end_date and obj.status == Airdrop.Status.ACTIVE:
            delta = obj.end_date - timezone.now()
            if delta.total_seconds() > 0:
                days = delta.days
                hours = delta.seconds // 3600
                return f"{days}d {hours}h"
        return None
