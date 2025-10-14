from rest_framework import serializers
from .models import User

class RegisterSerializer(serializers.ModelSerializer):
    """Serializer for user registration."""
    password = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        # Expose all fields required for registration
        fields = ('username', 'email', 'password', 'password2', 'first_name', 'last_name')

    def validate(self, attrs):
        if attrs['password'] != attrs.pop('password2'):
            raise serializers.ValidationError({"password": "Passwords must match."})
        return attrs

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class ProfileUpdateSerializer(serializers.ModelSerializer):
    """Serializer for authenticated user to view/update their profile."""
    class Meta:
        model = User
        fields = (
            'username', 'email', 'first_name', 'last_name', 
            'phone_number', 'profile_pic', 
            'show_email', 'show_phone', 
            'is_customer', 'is_admin' # Read-only access
        )
        read_only_fields = ('is_customer', 'is_admin')
        # Ensure email cannot be updated without a separate verification flow (best practice)
        extra_kwargs = {'email': {'read_only': True}}