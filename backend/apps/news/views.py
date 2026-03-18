from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from .models import Article, Category, Tag
from .serializers import ArticleListSerializer, ArticleDetailSerializer, CategorySerializer, TagSerializer
from .filters import ArticleFilter


CACHE_TTL = 60 * 5  # 5 phút


class ArticleViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = (
        Article.objects
        .filter(status=Article.Status.PUBLISHED)
        .select_related("source", "category")
        .prefetch_related("tags")
    )
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ArticleFilter
    search_fields = ["title", "title_vi", "summary", "summary_vi", "tags__name"]
    ordering_fields = ["published_at", "view_count"]
    ordering = ["-published_at"]
    lookup_field = "slug"

    def get_serializer_class(self):
        if self.action == "retrieve":
            return ArticleDetailSerializer
        return ArticleListSerializer

    @method_decorator(cache_page(CACHE_TTL))
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # Tăng view count không blocking
        Article.objects.filter(pk=instance.pk).update(view_count=instance.view_count + 1)
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    @method_decorator(cache_page(CACHE_TTL))
    def trending(self, request):
        """Top 10 bài được xem nhiều nhất trong 24h"""
        from django.utils import timezone
        from datetime import timedelta

        since = timezone.now() - timedelta(hours=24)
        qs = self.get_queryset().filter(published_at__gte=since).order_by("-view_count")[:10]
        serializer = ArticleListSerializer(qs, many=True, context={"request": request})
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    @method_decorator(cache_page(CACHE_TTL))
    def latest(self, request):
        """10 bài mới nhất"""
        qs = self.get_queryset()[:10]
        serializer = ArticleListSerializer(qs, many=True, context={"request": request})
        return Response(serializer.data)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.filter(is_active=True).annotate(
        article_count=__import__("django.db.models", fromlist=["Count"]).Count("articles")
    )
    serializer_class = CategorySerializer
    lookup_field = "slug"

    @method_decorator(cache_page(60 * 30))  # cache 30 phút
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
