"""Top-level URL configuration for the Algomination v2 backend."""

from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path


def health(_request):
    """Simple liveness probe used to verify the API is up."""
    return JsonResponse({"status": "ok", "service": "algomination-v2-api"})


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/health/", health, name="health"),
    path("api/auth/", include("accounts.urls")),
    path("api/community/", include("community.urls")),
]
