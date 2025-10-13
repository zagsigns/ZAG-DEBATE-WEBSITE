from rest_framework import serializers
from .models import Debate
from accounts.serializers import UserSerializer

class DebateSerializer(serializers.ModelSerializer):
    creator = UserSerializer(read_only=True)
    participants = UserSerializer(read_only=True, many=True)
    
    class Meta:
        model = Debate
        fields = ['id', 'title', 'description', 'creator', 'participants', 'max_participants', 'created_at', 'subscription_fee']
