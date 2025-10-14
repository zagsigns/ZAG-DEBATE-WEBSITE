from django.urls import re_path
from . import consumers

# Matches /ws/debates/1/, /ws/debates/2/, etc.
websocket_urlpatterns = [
    re_path(r'ws/debates/(?P<debate_id>\d+)/$', consumers.DebateConsumer.as_asgi()),
]