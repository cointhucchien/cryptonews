# filters.py
import django_filters
from .models import Article


class ArticleFilter(django_filters.FilterSet):
    category = django_filters.CharFilter(field_name="category__slug")
    tag = django_filters.CharFilter(field_name="tags__slug")
    language = django_filters.CharFilter(field_name="language")
    sentiment = django_filters.CharFilter(field_name="sentiment")
    source = django_filters.CharFilter(field_name="source__id")
    date_from = django_filters.DateFilter(field_name="published_at", lookup_expr="date__gte")
    date_to = django_filters.DateFilter(field_name="published_at", lookup_expr="date__lte")

    class Meta:
        model = Article
        fields = ["category", "tag", "language", "sentiment", "source"]
