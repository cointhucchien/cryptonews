from django.contrib import admin
from .models import CryptoPrice

@admin.register(CryptoPrice)
class CryptoPriceAdmin(admin.ModelAdmin):
    list_display = ["rank", "symbol", "name", "price_usd", "change_24h", "updated_at"]
    search_fields = ["name", "symbol"]
    ordering = ["rank"]
