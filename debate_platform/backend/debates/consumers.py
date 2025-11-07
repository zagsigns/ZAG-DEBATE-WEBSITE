from channels.generic.websocket import AsyncWebsocketConsumer
import json
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from debates.models import Debate
from accounts.models import User

class DebateConsumer(AsyncWebsocketConsumer):
    """
    Handles real-time communication for a specific debate room, including chat 
    and signals for video/voice/group calls.
    """
    
    async def connect(self):
        # The user is attached to scope['user'] by TokenAuthMiddleware
        self.user = self.scope['user'] 
        self.debate_id = self.scope['url_route']['kwargs']['debate_id']
        self.debate_group_name = f'debate_{self.debate_id}'
        
        # 1. CRITICAL: Check Authentication and Debate Existence
        if not await self.is_user_authorized():
            await self.close(code=4001) # 4001 = Auth Failure
            return

        # 2. Join the group (Channel Layer)
        await self.channel_layer.group_add(
            self.debate_group_name,
            self.channel_name
        )
        
        # 3. Accept the connection
        await self.accept()

        # Optional: Announce that a user has joined the room
        await self.channel_layer.group_send(
            self.debate_group_name,
            {
                'type': 'debate.message',
                'message': f'{self.user.username} has joined the debate.',
                'sender': 'System',
                'timestamp': str(timezone.now()), # Note: requires timezone import
            }
        )

    async def disconnect(self, close_code):
        # Announce the user is leaving
        if self.user and self.user.is_authenticated:
            await self.channel_layer.group_send(
                self.debate_group_name,
                {
                    'type': 'debate.message',
                    'message': f'{self.user.username} has left the debate.',
                    'sender': 'System',
                    'timestamp': str(timezone.now()),
                }
            )
        
        # Leave the group
        await self.channel_layer.group_discard(
            self.debate_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        """Receives messages from the WebSocket and routes them."""
        data = json.loads(text_data)
        command = data.get('command')

        if command == 'send_chat':
            await self.send_chat_message(data)
        elif command == 'video_signal':
            await self.send_video_signal(data)
        # Add other commands like 'start_call', 'end_call', etc.

    async def send_chat_message(self, data):
        """Sends a standard chat message to the group."""
        message = data.get('message')
        
        # Send message to room group
        await self.channel_layer.group_send(
            self.debate_group_name,
            {
                'type': 'debate.message', # Handler method name below
                'message': message,
                'sender': self.user.username,
                'timestamp': str(timezone.now()),
            }
        )

    async def send_video_signal(self, data):
        """Relays WebRTC signaling data for peer-to-peer connection."""
        # This is essential for voice/video calls
        await self.channel_layer.group_send(
            self.debate_group_name,
            {
                'type': 'debate.signal',
                'signal_type': data.get('signal_type'), # e.g., 'offer', 'answer', 'ice'
                'signal_data': data.get('signal_data'),
                'sender_channel_name': self.channel_name,
                'sender_id': self.user.id
            }
        )

    # --- Handlers (Received from Channel Layer) ---

    async def debate_message(self, event):
        """Handler for 'debate.message' type sent by the group."""
        await self.send(text_data=json.dumps({
            'type': 'chat_message',
            'message': event['message'],
            'sender': event['sender'],
            'timestamp': event['timestamp'],
        }))

    async def debate_signal(self, event):
        """Handler for 'debate.signal' type (WebRTC)."""
        # Only send the signal to other users, not back to the sender
        if event['sender_channel_name'] != self.channel_name:
            await self.send(text_data=json.dumps({
                'type': 'video_signal',
                'signal_type': event['signal_type'],
                'signal_data': event['signal_data'],
                'sender_id': event['sender_id']
            }))
    
    # --- Database/Auth Checks (Helper methods) ---
    
    @database_sync_to_async
    def is_user_authorized(self):
        """Checks if the user is authenticated and the debate exists."""
        from django.utils import timezone # Import here to avoid circular dependency issues

        if not self.user.is_authenticated:
            return False
            
        try:
            debate = Debate.objects.get(pk=self.debate_id, status__in=['OPEN', 'ACTIVE'])
            # You might add checks here: 
            # 1. Has the user paid the fee? (Handled in DebateJoinView, but a good place for a final check)
            # 2. Is the debate full?
            return True
        except Debate.DoesNotExist:
            print(f"Debate {self.debate_id} not found or not open.")
            return False