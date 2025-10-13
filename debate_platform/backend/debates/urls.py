from django.urls import path
from .views import (
    DebateListCreateView,
    DebateRetrieveUpdateDeleteView,
    JoinDebateView,
    LeaveDebateView
)

urlpatterns = [
    path('', DebateListCreateView.as_view(), name='debate_list_create'),
    path('<int:pk>/', DebateRetrieveUpdateDeleteView.as_view(), name='debate_detail'),
    path('<int:pk>/join/', JoinDebateView.as_view(), name='debate_join'),
    path('<int:pk>/leave/', LeaveDebateView.as_view(), name='debate_leave'),
]
