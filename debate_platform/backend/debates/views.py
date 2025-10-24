from rest_framework import generics, permissions
from rest_framework.permissions import IsAdminUser
from .models import Debate
# Assuming you have a DebateSerializer defined in debates/serializers.py
from .serializers import DebateSerializer 
from payments.models import UserCredit, UserSubscription, Transaction 
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
from django.db.models import Sum, F 
from django.utils import timezone

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
    permission_classes = [IsAdminOrReadOnly]

    def perform_update(self, serializer):
        # Only the creator or admin can update the debate
        if self.request.user == serializer.instance.creator or self.request.user.is_admin:
            serializer.save()
        else:
            raise permissions.PermissionDenied("You do not have permission to edit this debate.")
    
    def perform_destroy(self, instance):
        # Only the creator or admin can delete the debate
        if self.request.user == instance.creator or self.request.user.is_admin:
            instance.delete()
        else:
            raise permissions.PermissionDenied("You do not have permission to delete this debate.")


class DebateJoinView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            debate = Debate.objects.get(pk=pk)
        except Debate.DoesNotExist:
            return Response({"detail": "Debate not found."}, status=status.HTTP_404_NOT_FOUND)

        user = request.user
        fee = debate.subscription_fee

        if user in debate.participants.all():
            return Response({"detail": "You have already joined this debate."}, status=status.HTTP_400_BAD_REQUEST)

        if debate.participants.count() >= debate.max_participants:
            return Response({"detail": "This debate has reached its maximum number of participants."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Creator cannot join their own debate for fee payment logic simplification
        if user == debate.creator and fee > 0:
             return Response({"detail": "Debate creator does not need to pay the fee."}, status=status.HTTP_400_BAD_REQUEST)


        # 1. Pre-Check: Credits and Subscription
        user_credit, _ = UserCredit.objects.get_or_create(user=user)
        # Convert to integer for comparison with UserCredit.balance, assuming 1:1 credit-to-fee mapping
        required_credits = int(fee) 

        # Check for active subscription
        is_subscriber = UserSubscription.objects.filter(
            user=user, 
            is_active=True, 
            end_date__gte=timezone.now()
        ).exists()

        if fee > 0 and not is_subscriber and user_credit.balance < required_credits:
            return Response({"detail": "Insufficient credits and no active subscription to join."}, status=status.HTTP_402_PAYMENT_REQUIRED)

        # 2. Process Transaction and Join Debate (Atomic operation)
        try:
            with transaction.atomic():
                if fee > 0 and not is_subscriber:
                    # Deduct user credits
                    user_credit.balance -= required_credits
                    user_credit.save()
                    
                    # Log the user's expense transaction
                    Transaction.objects.create(
                        user=user,
                        transaction_type='DEB',
                        amount=-fee, # Negative amount means expense for user
                        debate_id=debate.pk
                    )

                    # Calculate creator share (assuming 75% for creator, 25% commission)
                    # NOTE: This should match the logic in the Debate model if defined there.
                    creator_share = fee * (1 - Debate.ADMIN_COMMISSION_RATE)
                    
                    # Log the creator's earning accrual
                    Transaction.objects.create(
                        user=debate.creator,
                        transaction_type='EAR', # Earning Accrual
                        amount=creator_share, # Positive amount for income accrual
                        debate_id=debate.pk
                    )
                    
                # Add user to debate participants
                debate.participants.add(user)
                
            return Response({"detail": "Successfully joined the debate."}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"detail": f"An error occurred during joining: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CreatorEarningView(APIView):
    """
    Shows the debate creator their total accrued, unwithdrawn earnings balance.
    Maps to /api/debates/earnings/
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        
        # Sum of Earning Accruals (EAR)
        earnings = Transaction.objects.filter(user=user, transaction_type='EAR').aggregate(Sum('amount'))['amount__sum'] or 0
        # Sum of Withdrawal Transactions (WDR - these amounts are stored as negative)
        withdrawals = Transaction.objects.filter(user=user, transaction_type='WDR').aggregate(Sum('amount'))['amount__sum'] or 0
        
        # WDR amounts are negative (to offset EAR), so adding them calculates the net balance
        current_earning_balance = earnings + withdrawals 
        
        return Response({
            "creator_username": user.username,
            # Format to two decimal places for currency display
            "withdrawable_balance": f"{current_earning_balance:.2f}",
        }, status=status.HTTP_200_OK)


class CommissionWithdrawalView(APIView):
    """
    Allows the debate creator to withdraw their accrued earnings into their UserCredit balance.
    Maps to /api/debates/withdraw-earnings/
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        
        # 1. Calculate Total Withdrawable Earnings
        earnings = Transaction.objects.filter(user=user, transaction_type='EAR').aggregate(Sum('amount'))['amount__sum'] or 0
        withdrawals = Transaction.objects.filter(user=user, transaction_type='WDR').aggregate(Sum('amount'))['amount__sum'] or 0
        
        amount_to_withdraw = earnings + withdrawals
        
        if amount_to_withdraw <= 0:
            return Response({"detail": "You have no outstanding earnings to withdraw."}, status=status.HTTP_400_BAD_REQUEST)

        # 2. Process Withdrawal (Atomic operation)
        try:
            with transaction.atomic():
                user_credit = UserCredit.objects.select_for_update().get(user=user)
                
                # Convert the decimal earning to an integer for credit balance
                # Note: We must round down or truncate if converting float to int for credits
                credit_amount = int(amount_to_withdraw) 
                
                # a) Add credits to user's balance
                user_credit.balance += credit_amount
                user_credit.save()
                
                # b) Log Withdrawal Transaction (negative amount to offset the EAR balance)
                Transaction.objects.create(
                    user=user,
                    transaction_type='WDR',
                    # Amount to zero out the existing positive EAR accrual balance
                    amount=-amount_to_withdraw, 
                )
                
            return Response({
                "detail": f"Successfully withdrew ${amount_to_withdraw:.2f} in earnings and converted to {credit_amount} credits.",
                "new_credit_balance": user_credit.balance
            }, status=status.HTTP_200_OK)

        except UserCredit.DoesNotExist:
            return Response({"detail": "User Credit record not found."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            return Response({"detail": f"Withdrawal failed: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
