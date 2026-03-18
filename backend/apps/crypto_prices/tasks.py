from celery import shared_task
import httpx
import logging
from django.conf import settings

logger = logging.getLogger(__name__)

COINGECKO_URL = "https://api.coingecko.com/api/v3/coins/markets"
TOP_COINS = 100  # Lấy top 100 coin


@shared_task
def update_prices():
    """Cập nhật giá từ CoinGecko API mỗi 2 phút"""
    from .models import CryptoPrice

    params = {
        "vs_currency": "usd",
        "order": "market_cap_desc",
        "per_page": TOP_COINS,
        "page": 1,
        "sparkline": False,
        "price_change_percentage": "1h,24h,7d",
    }
    headers = {}
    if settings.COINGECKO_API_KEY:
        headers["x-cg-demo-api-key"] = settings.COINGECKO_API_KEY

    try:
        with httpx.Client(timeout=15) as client:
            resp = client.get(COINGECKO_URL, params=params, headers=headers)
            resp.raise_for_status()
            coins = resp.json()

        for i, coin in enumerate(coins):
            CryptoPrice.objects.update_or_create(
                coin_id=coin["id"],
                defaults={
                    "symbol": coin["symbol"].upper(),
                    "name": coin["name"],
                    "logo": coin.get("image", ""),
                    "price_usd": coin.get("current_price") or 0,
                    "market_cap": coin.get("market_cap"),
                    "volume_24h": coin.get("total_volume"),
                    "change_1h": coin.get("price_change_percentage_1h_in_currency"),
                    "change_24h": coin.get("price_change_percentage_24h"),
                    "change_7d": coin.get("price_change_percentage_7d_in_currency"),
                    "ath": coin.get("ath"),
                    "rank": coin.get("market_cap_rank") or (i + 1),
                },
            )

        logger.info(f"Updated prices for {len(coins)} coins")

    except Exception as e:
        logger.error(f"CoinGecko fetch error: {e}")
        raise
