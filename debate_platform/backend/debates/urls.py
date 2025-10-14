from django.urls import path
from .views import DebateListCreateView, DebateDetailView

urlpatterns = [
    path('', DebateListCreateView.as_view(), name='debate-list-create'),
    path('<int:id>/', DebateDetailView.as_view(), name='debate-detail'),
]