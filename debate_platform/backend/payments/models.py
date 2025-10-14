from django.db import models
from accounts.models import User

# --- 1. Subscription Management ---
class MembershipPlan(models.Model):
    PLAN_CHOICES = [
        ('M', 'Monthly'),
        ('A', 'Annual'),
    ]
    name = models.CharField(max_length=50) # Basic Monthly, Premium Annual
    plan_type = models.CharField(max_length=1, choices=PLAN_CHOICES)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    duration_days = models.IntegerField(help_text="30 for Monthly, 365 for Annual")
    is_active = models.BooleanField(default=True)
    free_trial_days = models.IntegerField(default=7)

    def __str__(self):
        return f"{self.name} (${self.price})"

class UserSubscription(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='subscription')
    plan = models.ForeignKey(MembershipPlan, on_delete=models.SET_NULL, null=True)
    start_date = models.DateTimeField(auto_now_add=True)
    end_date = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.user.username} - {self.plan.name}"

# --- 2. Credits System ---
class CreditPackage(models.Model):
    name = models.CharField(max_length=50) # Small Pack, Mega Pack
    credit_amount = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} ({self.credit_amount} Credits)"

class UserCredit(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='credits')
    balance = models.IntegerField(default=0)
    
    def __str__(self):
        return f"{self.user.username} - {self.balance} Credits"

# --- 3. Transactions & Earnings (for Admin/Reporting) ---
class Transaction(models.Model):
    TRANSACTION_TYPES = [
        ('SUB', 'Subscription Payment'),
        ('CRD', 'Credit Purchase'),
        ('DEB', 'Debate Fee Payment'),
        ('COM', 'Commission Withdrawal'),
    ]
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='transactions')
    transaction_type = models.CharField(max_length=3, choices=TRANSACTION_TYPES)
    amount = models.DecimalField(max_digits=10, decimal_places=2) # Positive for Income, Negative for Expense/Payout
    timestamp = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.transaction_type} - ${self.amount} by {self.user.username}"