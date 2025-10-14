from rest_framework import generics, permissions
from .models import MembershipPlan, CreditPackage, UserCredit
from .serializers import MembershipPlanSerializer, CreditPackageSerializer, UserCreditSerializer

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