"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings # Import settings
from django.conf.urls.static import static # Import static functions

urlpatterns = [
    path('admin/', admin.site.urls),
    # API Router
    path('api/accounts/', include('accounts.urls')),
    path('api/debates/', include('debates.urls')),
    path('api/payments/', include('payments.urls')),
]

# Only for development: Serve media files like profile pictures
if settings.DEBUG:
    # You must define MEDIA_URL and MEDIA_ROOT in settings.py first
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)