from django.contrib import admin
from django.urls import path, include
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.conf import settings
from rest_framework import permissions

schema_view = get_schema_view(
    openapi.Info(
        title="Pwned Proxy API",
        default_version='v1',
        description="A proxy API for HaveIBeenPwned restricted by domain-specific API keys.",
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
    url=f"{'https' if not settings.DEBUG else 'http'}://{settings.PWNED_PROXY_DOMAIN}",
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v3/', include('api.urls')),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0)),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0)),

    # Redirect root to /swagger/
    path('', schema_view.with_ui('swagger', cache_timeout=0)),
]


