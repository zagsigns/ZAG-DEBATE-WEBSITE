from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db import transaction
from django.utils import timezone
from .models import Debate
from .serializers import DebateSerializer
from payments.models import UserCredit, Transaction

# --- Constants ---
DEBATE_FEE = 10 # Cost to join a debate in credits
CREATOR_COMMISSION_RATE = 0.75 # 75% commission rate

# --- Permissions ---
class IsCreatorOrReadOnly(IsAuthenticated):
    """
    Custom permission to allow read access to anyone, 
    but only allow the creator to update/delete their own debate.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in ('GET', 'HEAD', 'OPTIONS'):
            return True
        return obj.creator == request.user

# --- 1. Debate CRUD Views ---

class DebateListCreateView(generics.ListCreateAPIView):
    """List all debates or create a new one."""
    queryset = Debate.objects.all().order_by('-created_at')
    serializer_class = DebateSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # Automatically set the creator to the current authenticated user
        serializer.save(creator=self.request.user)

class DebateRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, Update, or Delete a specific debate."""
    queryset = Debate.objects.all()
    serializer_class = DebateSerializer
    # Only the creator can update/delete
    permission_classes = [IsCreatorOrReadOnly] 
    lookup_field = 'id'


# --- 2. Core Payment & Commission Logic Views ---

class DebateJoinView(APIView):
    """
    Handles the atomic transaction for a user joining a debate:
    1. Check if user has enough credits.
    2. Debit credits from UserCredit.
    3. Log Transaction for the user (Expense: -10.00).
    4. Log Transaction for the creator (Accrual: +7.50, 75% commission).
    5. Log Transaction for the platform (Income: +2.50, 25% fee).
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, debate_id):
        try:
            debate = Debate.objects.get(id=debate_id, status__in=['OPEN', 'ACTIVE'])
        except Debate.DoesNotExist:
            return Response({"detail": "Debate not found or not available."}, status=status.HTTP_404_NOT_FOUND)

        if debate.participants.filter(id=request.user.id).exists():
            return Response({"detail": "You have already joined this debate."}, status=status.HTTP_400_BAD_REQUEST)

        # Ensure the creator is not trying to pay to join their own debate
        if debate.creator == request.user:
            debate.participants.add(request.user)
            return Response({"detail": "Creator joined successfully (no fee applied)."}, status=status.HTTP_200_OK)

        try:
            with transaction.atomic():
                user_credit = UserCredit.objects.select_for_update().get(user=request.user)
                
                if user_credit.balance < DEBATE_FEE:
                    return Response({"detail": f"Insufficient credits. Requires {DEBATE_FEE}."}, status=status.HTTP_402_PAYMENT_REQUIRED)

                # 1. DEBIT: User Pays Debate Fee
                user_credit.balance -= DEBATE_FEE
                user_credit.save()

                # 2. LOG: User Expense Transaction (DEB)
                Transaction.objects.create(
                    user=request.user,
                    transaction_type='DEB',
                    amount=-DEBATE_FEE, # Negative amount for expense
                    debate_id=debate.id 
                )
                
                # Calculate commission (75% for creator, 25% for platform)
                creator_earning = DEBATE_FEE * CREATOR_COMMISSION_RATE
                platform_fee = DEBATE_FEE - creator_earning

                # 3. LOG: Creator Earning Accrual (EAR) - Positive amount for income accrual
                Transaction.objects.create(
                    user=debate.creator,
                    transaction_type='EAR',
                    amount=creator_earning, 
                    debate_id=debate.id 
                )

                # 4. LOG: Platform Fee Income (SUB/CRD is income, use a new type or existing CRD/SUB)
                # Note: For simplicity, we can just track the net EAR/DEB, but for full audit, 
                # we'd log the platform cut separately. We'll skip logging platform cut directly 
                # and rely on reports (Income = SUB + CRD + (DEB - EAR)).
                
                # 5. ADD: User to Debate Participants
                debate.participants.add(request.user)

            return Response({"detail": "Joined debate successfully. Credits debited."}, status=status.HTTP_200_OK)

        except UserCredit.DoesNotExist:
            # Should not happen if UserCredit is created on user signup
            return Response({"detail": "User credit account not found."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CreatorEarningView(APIView):
    """
    Allows a creator to convert their accrued EARNINGS (from Transaction table) 
    into CREDITS (in UserCredit balance).
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Calculate the total accrued earnings available for withdrawal."""
        # Sum of all positive 'EAR' transactions that haven't been 'WDR' offset
        accrued_earnings = Transaction.objects.filter(
            user=request.user, 
            transaction_type__in=['EAR']
        ).aggregate(
            total_earned=models.Sum('amount')
        )['total_earned'] or 0
        
        # Sum of all negative 'WDR' transactions (withdrawals)
        withdrawn_amount = Transaction.objects.filter(
            user=request.user,
            transaction_type='WDR'
        ).aggregate(
            total_withdrawn=models.Sum('amount')
        )['total_withdrawn'] or 0

        current_balance = accrued_earnings + withdrawn_amount
        return Response({"available_earnings": round(current_balance, 2)}, status=status.HTTP_200_OK)

    def post(self, request):
        """Execute the conversion from earnings to credits."""
        
        # Get the available balance using the GET logic
        accrued_earnings = Transaction.objects.filter(
            user=request.user, 
            transaction_type='EAR'
        ).aggregate(total_earned=models.Sum('amount'))['total_earned'] or 0
        
        withdrawn_amount = Transaction.objects.filter(
            user=request.user,
            transaction_type='WDR'
        ).aggregate(total_withdrawn=models.Sum('amount'))['total_withdrawn'] or 0
        
        amount_to_withdraw = accrued_earnings + withdrawn_amount
        amount_to_withdraw = round(amount_to_withdraw, 2)
        
        if amount_to_withdraw <= 0.01:
            return Response({"detail": "No eligible earnings to withdraw."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            with transaction.atomic():
                user_credit = UserCredit.objects.select_for_update().get(user=request.user)
                
                # 1. CREDIT: Add equivalent credits to UserCredit balance
                # Assuming 1.00 currency unit = 1 credit for simplicity in conversion
                credits_to_add = int(amount_to_withdraw)
                user_credit.balance += credits_to_add
                user_credit.save()

                # 2. LOG: Withdrawal Transaction (WDR)
                # This transaction acts as a negative offset to zero out the accrued earnings balance
                Transaction.objects.create(
                    user=request.user,
                    transaction_type='WDR',
                    amount=-amount_to_withdraw, # Negative amount offsets the accrued EAR balance
                    external_ref=f"Converted to {credits_to_add} credits"
                )

            return Response({
                "detail": "Earnings successfully converted to credits.",
                "credits_added": credits_to_add,
                "new_credit_balance": user_credit.balance
            }, status=status.HTTP_200_OK)

        except UserCredit.DoesNotExist:
            return Response({"detail": "User credit account not found."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)