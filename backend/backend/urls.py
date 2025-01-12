from django.urls import path, include
from django.contrib import admin
from rest_framework_simplejwt.views import TokenRefreshView
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('users.urls')),
    path('api/schools/', include('schools.urls')),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
