# views.py
from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Airdrop
from .serializers import AirdropSerializer


class AirdropViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Airdrop.objects.all()
    serializer_class = AirdropSerializer
    lookup_field = "slug"
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["status", "airdrop_type", "is_featured", "is_verified"]
    search_fields = ["name", "token_symbol", "description"]
    ordering_fields = ["created_at", "estimated_value", "end_date"]
    ordering = ["-is_featured", "-created_at"]
