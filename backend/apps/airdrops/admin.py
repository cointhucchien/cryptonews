from django.contrib import admin
from .models import Airdrop

@admin.register(Airdrop)
class AirdropAdmin(admin.ModelAdmin):
    list_display = ["name", "token_symbol", "airdrop_type", "status", "is_featured", "is_verified"]
    list_filter = ["status", "airdrop_type", "is_featured", "is_verified"]
    search_fields = ["name", "token_symbol"]
    prepopulated_fields = {"slug": ("name",)}
