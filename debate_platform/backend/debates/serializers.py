from rest_framework import serializers
from .models import Debate

class DebateSerializer(serializers.ModelSerializer):
    creator_username = serializers.ReadOnlyField(source='creator.username')
    participant_count = serializers.IntegerField(source='participants.count', read_only=True)
    # This field will be visible to Admin only (via context)
    commission = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True, source='commission_due') 

    class Meta:
        model = Debate
        fields = [
            'id', 'title', 'description', 'creator', 'creator_username',
            'participants', 'participant_count', 'max_participants', 
            'subscription_fee', 'created_at', 'commission'
        ]
        read_only_fields = ['creator', 'participants']