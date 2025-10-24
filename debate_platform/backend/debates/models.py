from django.db import models
from accounts.models import User

class Debate(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_debates')
    participants = models.ManyToManyField(User, related_name='debates')
    max_participants = models.IntegerField(default=100)
    created_at = models.DateTimeField(auto_now_add=True)
    # The fee charged to join the debate (in credits/currency)
    subscription_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    # Define the threshold and rates
    COMMISSION_THRESHOLD = 10 # Commission calculation starts after this many participants
    PLATFORM_COMMISSION_RATE = 0.25 # 25% of the fee goes to the platform
    CREATOR_EARNING_RATE = 1 - PLATFORM_COMMISSION_RATE # 75% goes to the creator

    def __str__(self):
        return self.title

    @property
    def platform_commission_per_participant(self):
        """Calculates the platform's 25% share per participant fee."""
        return self.subscription_fee * self.PLATFORM_COMMISSION_RATE

    @property
    def creator_earning_per_participant(self):
        """Calculates the creator's 75% share per participant fee."""
        return self.subscription_fee * self.CREATOR_EARNING_RATE

    # --- Reintroducing 'commission_due' as a method for Admin compatibility ---
    # This method is required by the Django Admin configuration (in debates/admin.py).
    def commission_due(self):
        """
        Provides a summary of the revenue split for the Django Admin interface.
        Note: Actual earnings/commissions are tracked in the separate Transaction model.
        """
        # Calculate the number of participants who joined (excluding the creator, as they don't pay)
        paid_participants_count = self.participants.exclude(id=self.creator.id).count() 
        
        if paid_participants_count == 0:
            return "No paid participants yet"

        platform_share = paid_participants_count * self.platform_commission_per_participant
        creator_share = paid_participants_count * self.creator_earning_per_participant
        
        return f"Participants: {paid_participants_count} | Platform: ${platform_share:.2f} | Creator: ${creator_share:.2f}"
    
    # Set a custom display name for the Admin
    commission_due.short_description = 'Revenue Summary'
    # ----------------------------------------------------------------------

# New Model for Real-Time Chat Messages
class Message(models.Model):
    debate = models.ForeignKey(Debate, on_delete=models.CASCADE, related_name='messages')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message by {self.user.username} in {self.debate.title}"
