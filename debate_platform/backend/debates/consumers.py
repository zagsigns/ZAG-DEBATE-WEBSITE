import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from .models import Debate, Message
from accounts.models import User

class DebateConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # The debate ID will be passed in the URL path, e.g., ws://.../ws/debates/1/
        self.debate_id = self.scope['url_route']['kwargs']['debate_id']
        self.debate_group_name = f'debate_{self.debate_id}'
        self.user = self.scope['user']

        if not self.user.is_authenticated:
            await self.close(code=4001) # Not authenticated
            return

        # Check if the user is a participant (optional but recommended for access control)
        is_participant = await self.is_user_participant()
        if not is_participant:
            await self.close(code=4003) # Forbidden
            return

        # Join room group
        await self.channel_layer.group_add(
            self.debate_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.debate_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json.get('message')

        if message:
            # Save message to database (synchronous operation)
            await self.save_message(message)

            # Send message to room group
            await self.channel_layer.group_send(
                self.debate_group_name,
                {
                    'type': 'chat_message',
                    'message': message,
                    'username': self.user.username,
                    'timestamp': str(await sync_to_async(self.get_current_time)()),
                }
            )

    # Receive message from room group
    async def chat_message(self, event):
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'username': event['username'],
            'message': event['message'],
            'timestamp': event['timestamp'],
        }))

    @sync_to_async
    def is_user_participant(self):
        """Check if the user is a participant of the debate."""
        try:
            debate = Debate.objects.get(id=self.debate_id)
            return debate.participants.filter(id=self.user.id).exists()
        except Debate.DoesNotExist:
            return False

    @sync_to_async
    def save_message(self, content):
        """Saves the message to the database."""
        debate = Debate.objects.get(id=self.debate_id)
        Message.objects.create(debate=debate, user=self.user, content=content)

    @sync_to_async
    def get_current_time(self):
        """Helper to get current time (used for timestamp in group send)"""
        from django.utils import timezone
        return timezone.now()



# debates/consumers.py (Update the existing DebateConsumer class)
import json
from channels.generic.websocket import AsyncWebsocketConsumer
# ... other imports ... 

class DebateConsumer(AsyncWebsocketConsumer):
    # ... (existing connect, disconnect, chat_message, save_message, etc. methods) ...
    
    # Receive message from WebSocket (Update the existing method)
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        
        # Check for message type (chat or signal)
        if 'message' in text_data_json:
            # --- CHAT MESSAGE ---
            message = text_data_json.get('message')
            if message:
                await self.save_message(message)

                await self.channel_layer.group_send(
                    self.debate_group_name,
                    {
                        'type': 'chat_message',
                        'message': message,
                        'username': self.user.username,
                        'timestamp': str(await sync_to_async(self.get_current_time)()),
                    }
                )
        
        elif 'type' in text_data_json and 'signal' in text_data_json:
            # --- WEBRTC SIGNALING MESSAGE ---
            signal_type = text_data_json['type']
            signal_data = text_data_json['signal']
            
            # Forward the signal to the target user or all users in the group
            await self.channel_layer.group_send(
                self.debate_group_name,
                {
                    'type': 'call_signal',
                    'signal_type': signal_type,
                    'signal': signal_data,
                    'sender': self.user.username,
                    'sender_channel_name': self.channel_name # Identify the sender's specific connection
                }
            )


    # New Method: Receive/Forward call signals from room group
    async def call_signal(self, event):
        # Do not send the signal back to the sender
        if self.channel_name != event['sender_channel_name']:
            await self.send(text_data=json.dumps({
                'type': event['signal_type'],
                'signal': event['signal'],
                'sender': event['sender'],
            }))

    # ... (Keep existing async/sync methods: is_user_participant, save_message, get_current_time)