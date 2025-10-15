# backend/zag_debate_platform/asgi.py

import os

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
import debates.routing # We will create this file next

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'zag_debate_platform.settings')

# Initialize Django ASGI application early to ensure the settings are loaded
django_asgi_app = get_asgi_application()

application = ProtocolTypeRouter({
    # Standard Django HTTP requests go here
    "http": django_asgi_app,

    # WebSocket connections (channels) are handled here
    "websocket": AuthMiddlewareStack(
        URLRouter(
            debates.routing.websocket_urlpatterns
        )
    ),
})