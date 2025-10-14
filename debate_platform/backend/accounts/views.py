from rest_framework import generics, permissions
from .models import User
from .serializers import RegisterSerializer, ProfileUpdateSerializer

class RegisterView(generics.CreateAPIView):
    """Public endpoint to register a new user."""
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

class UserProfileView(generics.RetrieveUpdateAPIView):
    """Protected endpoint to view and update the authenticated user's profile."""
    serializer_class = ProfileUpdateSerializer
    permission_classes = (permissions.IsAuthenticated,)
    
    # Ensures the user can only interact with their own profile
    def get_object(self):
        return self.request.user