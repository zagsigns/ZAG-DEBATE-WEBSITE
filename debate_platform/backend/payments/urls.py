from django.urls import path
from .views import (
    PlanListView, 
    CreditPackageListView, 
    UserCreditView, 
    SubscribeView, # Assuming this exists in your payments/views.py
    BuyCreditsView, # Assuming this exists in your payments/views.py
    # Add other views as they are implemented
)

urlpatterns = [
    # Plans & Credits Listing
    path('plans/', PlanListView.as_view(), name='plan-list'),
    path('packages/', CreditPackageListView.as_view(), name='credit-package-list'),
    
    # User Credit Balance
    path('balance/', UserCreditView.as_view(), name='user-credit-balance'),

    # Purchase/Subscription Actions
    path('subscribe/', SubscribeView.as_view(), name='subscribe'),
    path('buy-credits/', BuyCreditsView.as_view(), name='buy-credits'),
]
