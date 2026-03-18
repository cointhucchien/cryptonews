from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CryptoPriceViewSet

router = DefaultRouter()
router.register("prices", CryptoPriceViewSet, basename="crypto-price")

urlpatterns = [path("", include(router.urls))]
