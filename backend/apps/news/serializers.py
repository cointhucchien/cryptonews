from rest_framework import serializers
from .models import Article, Category, Tag, NewsSource


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ["id", "name", "slug"]


class CategorySerializer(serializers.ModelSerializer):
    article_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Category
        fields = ["id", "name", "slug", "icon", "article_count"]


class NewsSourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsSource
        fields = ["id", "name", "website", "logo", "language"]


class ArticleListSerializer(serializers.ModelSerializer):
    """Dùng cho danh sách — ít field hơn để response nhẹ"""
    category = CategorySerializer(read_only=True)
    source = NewsSourceSerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)

    class Meta:
        model = Article
        fields = [
            "id", "slug", "title", "title_vi", "summary", "summary_vi",
            "thumbnail", "category", "source", "tags",
            "sentiment", "view_count", "language", "published_at",
        ]


class ArticleDetailSerializer(ArticleListSerializer):
    """Dùng cho trang chi tiết — full content"""

    class Meta(ArticleListSerializer.Meta):
        fields = ArticleListSerializer.Meta.fields + [
            "content", "original_url", "ai_summarized", "ai_translated",
            "created_at", "updated_at",
        ]
