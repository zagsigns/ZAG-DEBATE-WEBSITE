# backend/debates/routing.py

from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    # Routes connections like ws://127.0.0.1:8000/ws/debate/1/ to the DebateConsumer
    re_path(r'ws/debate/(?P<debate_id>\w+)/$', consumers.DebateConsumer.as_asgi()),
]