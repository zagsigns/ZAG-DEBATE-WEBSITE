from django.contrib import admin
from .models import (
    MembershipPlan, UserSubscription, 
    CreditPackage, UserCredit, Transaction
)

@admin.register(MembershipPlan)
class MembershipPlanAdmin(admin.ModelAdmin):
    list_display = ('name', 'plan_type', 'price', 'duration_days', 'is_active')
    list_filter = ('plan_type', 'is_active')

@admin.register(CreditPackage)
class CreditPackageAdmin(admin.ModelAdmin):
    list_display = ('name', 'credit_amount', 'price', 'is_active')

@admin.register(UserSubscription)
class UserSubscriptionAdmin(admin.ModelAdmin):
    list_display = ('user', 'plan', 'is_active', 'start_date', 'end_date')
    list_filter = ('plan', 'is_active')

@admin.register(UserCredit)
class UserCreditAdmin(admin.ModelAdmin):
    list_display = ('user', 'balance')
    search_fields = ('user__username',)

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('user', 'transaction_type', 'amount', 'timestamp')
    list_filter = ('transaction_type', 'timestamp')
    search_fields = ('user__username',)