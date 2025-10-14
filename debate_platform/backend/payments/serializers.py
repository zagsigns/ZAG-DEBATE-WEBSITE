from rest_framework import serializers
from .models import MembershipPlan, CreditPackage, UserCredit

class MembershipPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = MembershipPlan
        fields = '__all__'
        
class CreditPackageSerializer(serializers.ModelSerializer):
    class Meta:
        model = CreditPackage
        fields = '__all__'

class UserCreditSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')
    class Meta:
        model = UserCredit
        fields = ['username', 'balance']