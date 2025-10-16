from rest_framework import generics, permissions
from rest_framework.permissions import IsAdminUser
from .models import Debate
from .serializers import DebateSerializer

# Custom permission to allow Admins full control, but only allow non-admins to list/create/join
class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        # Admins always have permission
        if request.user and request.user.is_admin:
            return True
        # Read operations (GET, HEAD, OPTIONS) are allowed for all authenticated users
        if request.method in permissions.SAFE_METHODS:
            return request.user and request.user.is_authenticated
        # Non-admins can only POST (create)
        return request.method == 'POST' and request.user and request.user.is_authenticated

class DebateListCreateView(generics.ListCreateAPIView):
    queryset = Debate.objects.all().order_by('-created_at')
    serializer_class = DebateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # Set the creator to the currently authenticated user
        serializer.save(creator=self.request.user)
    
class DebateDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Debate.objects.all()
    serializer_class = DebateSerializer
    # Only Admins can edit or delete a debate. Other users can view.
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = 'id'

# You would add a view here for participants to join a debate later.

# debates/views.py (Add this to the existing file)
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
from payments.models import UserCredit, UserSubscription # Import payment models

class DebateJoinView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, debate_id):
        user = request.user
        try:
            debate = Debate.objects.get(id=debate_id)
        except Debate.DoesNotExist:
            return Response({"detail": "Debate not found."}, status=status.HTTP_404_NOT_FOUND)

        if debate.participants.filter(id=user.id).exists():
            return Response({"detail": "You are already a participant."}, status=status.HTTP_400_BAD_REQUEST)

        # 1. Check for Subscription/Fee Requirement
        fee = debate.subscription_fee
        if fee > 0:
            # Check if user has an active, non-trial subscription (bypasses fee)
            is_subscriber = user.subscription.is_active if hasattr(user, 'subscription') else False
            
            if not is_subscriber:
                # Deduct equivalent credits
                try:
                    user_credit = UserCredit.objects.get(user=user)
                    # For simplicity, assume 1 credit = 1 unit of currency (e.g., $1)
                    required_credits = int(fee) 
                    
                    if user_credit.balance < required_credits:
                        return Response({"detail": f"Insufficient credits. Requires {required_credits} credits."}, status=status.HTTP_402_PAYMENT_REQUIRED)

                except UserCredit.DoesNotExist:
                    return Response({"detail": "Please buy credits or a subscription to join."}, status=status.HTTP_402_PAYMENT_REQUIRED)

        # 2. Process Transaction and Join Debate (Atomic operation)
        try:
            with transaction.atomic():
                if fee > 0 and not is_subscriber:
                    user_credit.balance -= required_credits
                    user_credit.save()
                    
                    # Log the debate fee transaction
                    Transaction.objects.create(
                        user=user,
                        transaction_type='DEB',
                        amount=-fee # Negative amount means expense for user
                    )
                    
                    # Admin Revenue (Commission is calculated later, this is just the gross fee)
                    Transaction.objects.create(
                        user=debate.creator,
                        transaction_type='DEB',
                        amount=fee # Positive amount means income for the system
                    )

                # Add user to debate participants
                debate.participants.add(user)
                
            return Response({"detail": "Successfully joined the debate."}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"detail": f"An error occurred during joining: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
