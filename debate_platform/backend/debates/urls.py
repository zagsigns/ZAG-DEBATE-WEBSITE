from django.urls import path
from .views import (
    DebateListCreateView, 
    DebateRetrieveUpdateDestroyView, 
    DebateJoinView, 
    CreatorEarningView
)

urlpatterns = [
    # Basic CRUD for Debates
    path('', DebateListCreateView.as_view(), name='debate-list-create'),
    path('<int:id>/', DebateRetrieveUpdateDestroyView.as_view(), name='debate-detail'),
    
    # Core Business Logic Endpoints
    path('<int:debate_id>/join/', DebateJoinView.as_view(), name='debate-join'),
    path('earnings/', CreatorEarningView.as_view(), name='creator-earnings'),
]