"""
ASGI config for backend project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/asgi/
"""

import os
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application

# Assume you will create debates/routing.py next
import debates.routing 

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

# The main router for the project
application = ProtocolTypeRouter({
    "http": get_asgi_application(), # Standard HTTP handling (for DRF)
    # WebSocket handling
    "websocket": AuthMiddlewareStack(
        # The URLRouter will look for definitions in debates/routing.py
        URLRouter(
            debates.routing.websocket_urlpatterns 
        )
    ),
})
