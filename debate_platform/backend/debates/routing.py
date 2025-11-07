# debates/routing.py

from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    # Use re_path for robustness, ensuring it matches the 'debate' endpoint
    re_path(r'ws/debate/(?P<debate_id>\w+)/$', consumers.DebateConsumer.as_asgi()),
    # Make sure you are using 'debate/' (singular) if that's what the frontend sends.
    # If the frontend sends 'debates/' (plural), change this to:
    # re_path(r'ws/debates/(?P<debate_id>\w+)/$', consumers.DebateConsumer.as_asgi()),
]