from django.shortcuts import render

# Create your views here.
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Debate
from .serializers import DebateSerializer
from accounts.models import User

class DebateListCreateView(generics.ListCreateAPIView):
    queryset = Debate.objects.all().order_by('-created_at')
    serializer_class = DebateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)

class DebateRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Debate.objects.all()
    serializer_class = DebateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def update(self, request, *args, **kwargs):
        debate = self.get_object()
        if debate.creator != request.user and not request.user.is_admin:
            return Response({"error": "You are not allowed to update this debate"}, status=status.HTTP_403_FORBIDDEN)
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        debate = self.get_object()
        if debate.creator != request.user and not request.user.is_admin:
            return Response({"error": "You are not allowed to delete this debate"}, status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)

# Join debate
from rest_framework.views import APIView

class JoinDebateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            debate = Debate.objects.get(pk=pk)
        except Debate.DoesNotExist:
            return Response({"error": "Debate not found"}, status=status.HTTP_404_NOT_FOUND)

        if debate.participants.filter(id=request.user.id).exists():
            return Response({"error": "Already joined"}, status=status.HTTP_400_BAD_REQUEST)

        if debate.participants.count() >= debate.max_participants:
            return Response({"error": "Debate is full"}, status=status.HTTP_400_BAD_REQUEST)

        debate.participants.add(request.user)
        debate.save()

        # Check commission logic
        participant_threshold = 3  # example threshold
        if debate.participants.count() >= participant_threshold:
            admin_share = debate.subscription_fee * 0.25
            # Here you could create a Payment/Commission record

        return Response({"success": "Joined debate", "participants_count": debate.participants.count()})

# Leave debate
class LeaveDebateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            debate = Debate.objects.get(pk=pk)
        except Debate.DoesNotExist:
            return Response({"error": "Debate not found"}, status=status.HTTP_404_NOT_FOUND)

        if not debate.participants.filter(id=request.user.id).exists():
            return Response({"error": "You are not part of this debate"}, status=status.HTTP_400_BAD_REQUEST)

        debate.participants.remove(request.user)
        debate.save()
        return Response({"success": "Left debate", "participants_count": debate.participants.count()})
