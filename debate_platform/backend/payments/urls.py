from django.urls import path
from .views import (
    PlanListView, CreditPackageListView, UserCreditView,
    SubscribeView, BuyCreditsView # Import new views
)

urlpatterns = [
    path('plans/', PlanListView.as_view(), name='membership-plans'),
    path('credits/packages/', CreditPackageListView.as_view(), name='credit-packages'),
    path('credits/balance/', UserCreditView.as_view(), name='user-credit-balance'),
    
    # New action endpoints
    path('subscribe/', SubscribeView.as_view(), name='subscribe'),
    path('buy-credits/', BuyCreditsView.as_view(), name='buy-credits'),
]