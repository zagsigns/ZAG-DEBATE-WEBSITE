# backend/zag_debate_platform/asgi.py

import os
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
import debates.routing 

# Import your custom middleware stack from the new file
from .middleware import TokenAuthMiddlewareStack 

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'zag_debate_platform.settings')

# Initialize Django ASGI application early to ensure the settings are loaded
django_asgi_app = get_asgi_application()

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    
    # WebSocket connections (channels) are handled here
    # Use the custom stack to authenticate users via the token in the URL
    "websocket": TokenAuthMiddlewareStack( 
        URLRouter(
            debates.routing.websocket_urlpatterns
        )
    ),
})