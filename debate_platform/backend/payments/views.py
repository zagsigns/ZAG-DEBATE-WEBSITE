from rest_framework import generics, permissions
from .models import MembershipPlan, CreditPackage, UserCredit
from .serializers import MembershipPlanSerializer, CreditPackageSerializer, UserCreditSerializer
from rest_framework.views import APIView


class PlanListView(generics.ListAPIView):
    """List all available subscription plans."""
    queryset = MembershipPlan.objects.filter(is_active=True)
    serializer_class = MembershipPlanSerializer
    permission_classes = [permissions.IsAuthenticated]

class CreditPackageListView(generics.ListAPIView):
    """List all available credit packages."""
    queryset = CreditPackage.objects.filter(is_active=True)
    serializer_class = CreditPackageSerializer
    permission_classes = [permissions.IsAuthenticated]

class UserCreditView(generics.RetrieveAPIView):
    """View the authenticated user's current credit balance."""
    serializer_class = UserCreditSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        # Retrieve or create the UserCredit object for the current user
        credit, created = UserCredit.objects.get_or_create(user=self.request.user)
        return credit 



# payments/views.py (Append to existing content)
from django.utils import timezone
from datetime import timedelta
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .models import MembershipPlan, CreditPackage, UserCredit, UserSubscription, Transaction
from accounts.models import User
from django.db import transaction

# --- Action Views ---

class SubscribeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        plan_id = request.data.get('plan_id')
        user = request.user
        
        try:
            plan = MembershipPlan.objects.get(id=plan_id, is_active=True)
        except MembershipPlan.DoesNotExist:
            return Response({"detail": "Invalid membership plan."}, status=status.HTTP_404_NOT_FOUND)

        # In a real app, external payment gateway processing happens here (Stripe/PayPal)
        # Assuming payment success for demonstration:
        
        try:
            with transaction.atomic():
                # 1. Calculate end date
                end_date = timezone.now() + timedelta(days=plan.duration_days)

                # 2. Update/Create Subscription
                sub, created = UserSubscription.objects.get_or_create(user=user)
                sub.plan = plan
                sub.start_date = timezone.now()
                sub.end_date = end_date
                sub.is_active = True
                sub.save()

                # 3. Log Transaction
                Transaction.objects.create(
                    user=user,
                    transaction_type='SUB',
                    amount=plan.price # Income for the platform
                )
                
            return Response({"detail": f"Subscribed successfully to {plan.name}."}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"detail": f"Subscription failed: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class BuyCreditsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        package_id = request.data.get('package_id')
        user = request.user

        try:
            package = CreditPackage.objects.get(id=package_id, is_active=True)
        except CreditPackage.DoesNotExist:
            return Response({"detail": "Invalid credit package."}, status=status.HTTP_404_NOT_FOUND)
        
        # Assuming external payment success:
        try:
            with transaction.atomic():
                # 1. Update User Credits
                user_credit, created = UserCredit.objects.get_or_create(user=user)
                user_credit.balance += package.credit_amount
                user_credit.save()

                # 2. Log Transaction
                Transaction.objects.create(
                    user=user,
                    transaction_type='CRD',
                    amount=package.price # Income for the platform
                )
                
            return Response({"detail": f"Successfully purchased {package.credit_amount} credits."}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"detail": f"Credit purchase failed: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)