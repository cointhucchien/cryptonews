from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

API_V1 = "api/v1/"

urlpatterns = [
    path("admin/", admin.site.urls),
    path(API_V1 + "news/",     include("apps.news.urls")),
    path(API_V1 + "airdrops/", include("apps.airdrops.urls")),
    path(API_V1 + "crypto/",   include("apps.crypto_prices.urls")),
    path(API_V1 + "auth/",     include("apps.accounts.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
