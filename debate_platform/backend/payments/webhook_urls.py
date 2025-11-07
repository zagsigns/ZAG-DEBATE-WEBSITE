# backend/payments/webhook_urls.py

from django.urls import path
from .views import stripe_webhook_view # Assuming you put the view in payments/views.py

urlpatterns = [
    # The URL Stripe will send events to
    path('stripe/', stripe_webhook_view, name='stripe-webhook'), 
]