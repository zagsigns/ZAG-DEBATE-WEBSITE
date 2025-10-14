from django.db import models
from accounts.models import User

class Debate(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_debates')
    participants = models.ManyToManyField(User, related_name='debates')
    max_participants = models.IntegerField(default=100)
    created_at = models.DateTimeField(auto_now_add=True)
    subscription_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    # Define the threshold for commission (e.g., 10 participants)
    COMMISSION_THRESHOLD = 10 
    ADMIN_COMMISSION_RATE = 0.25 # 25%

    def _str_(self):
        return self.title

    @property
    def commission_due(self):
        """Calculates commission based on participant threshold."""
        if self.participants.count() >= self.COMMISSION_THRESHOLD:
            # Assuming subscription_fee is the price per participant
            total_revenue = self.participants.count() * self.subscription_fee
            return total_revenue * self.ADMIN_COMMISSION_RATE
        return 0

# New Model for Real-Time Chat Messages
class Message(models.Model):
    debate = models.ForeignKey(Debate, on_delete=models.CASCADE, related_name='messages')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('timestamp',)

    def _str_(self):
        return f'{self.user.username}: {self.content[:20]}'