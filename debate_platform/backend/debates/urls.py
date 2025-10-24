from django.urls import path
from .views import (
    DebateListCreateView, 
    DebateDetailView, 
    DebateJoinView,
    CreatorEarningView, 
    CommissionWithdrawalView, 
)

urlpatterns = [
    # Debate CRUD
    path('', DebateListCreateView.as_view(), name='debate-list-create'),
    path('<int:pk>/', DebateDetailView.as_view(), name='debate-detail'),
    
    # Participant Actions
    path('<int:pk>/join/', DebateJoinView.as_view(), name='debate-join'),
    
    # Creator Earning/Commission Management
    path('earnings/', CreatorEarningView.as_view(), name='creator-earnings'), # GET to see balance
    path('withdraw/', CommissionWithdrawalView.as_view(), name='commission-withdrawal'), # POST to cash out
]
