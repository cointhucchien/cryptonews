from django.contrib import admin
from .models import Article, Category, Tag, NewsSource

@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ["title", "source", "category", "sentiment", "status", "published_at", "ai_summarized"]
    list_filter = ["status", "sentiment", "ai_summarized", "language", "category"]
    search_fields = ["title", "title_vi"]
    prepopulated_fields = {"slug": ("title",)}
    readonly_fields = ["view_count", "created_at", "updated_at"]
    date_hierarchy = "published_at"

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ["name", "slug", "is_active", "order"]
    prepopulated_fields = {"slug": ("name",)}

@admin.register(NewsSource)
class NewsSourceAdmin(admin.ModelAdmin):
    list_display = ["name", "language", "is_active", "last_crawled_at"]

admin.site.register(Tag)
