from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AirdropViewSet

router = DefaultRouter()
router.register("", AirdropViewSet, basename="airdrop")

urlpatterns = [path("", include(router.urls))]
