# views.py
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import CryptoPrice
from .serializers import CryptoPriceSerializer


class CryptoPriceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CryptoPrice.objects.all()
    serializer_class = CryptoPriceSerializer
    lookup_field = "coin_id"
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name", "symbol"]
    ordering_fields = ["rank", "price_usd", "market_cap", "change_24h"]
    ordering = ["rank"]

    @method_decorator(cache_page(60 * 2))   # cache 2 phút
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @action(detail=False, methods=["get"])
    @method_decorator(cache_page(60 * 2))
    def top10(self, request):
        qs = self.get_queryset()[:10]
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def gainers(self, request):
        """Top coin tăng giá trong 24h"""
        qs = self.get_queryset().filter(change_24h__gt=0).order_by("-change_24h")[:10]
        return Response(self.get_serializer(qs, many=True).data)

    @action(detail=False, methods=["get"])
    def losers(self, request):
        """Top coin giảm giá trong 24h"""
        qs = self.get_queryset().filter(change_24h__lt=0).order_by("change_24h")[:10]
        return Response(self.get_serializer(qs, many=True).data)
