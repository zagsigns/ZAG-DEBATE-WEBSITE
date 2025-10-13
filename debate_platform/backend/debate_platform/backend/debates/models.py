from django.db import models

# Create your models here.


from django.db import models
from accounts.models import User

class Debate(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    creator = models.ForeignKey(User, on_delete=models.CASCADE)
    participants = models.ManyToManyField(User, related_name='debates')
    max_participants = models.IntegerField(default=100)
    created_at = models.DateTimeField(auto_now_add=True)
    subscription_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def __str__(self):
        return self.title
