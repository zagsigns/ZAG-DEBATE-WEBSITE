# backend/zag_debate_platform/middleware.py

from channels.auth import AuthMiddlewareStack
from django.contrib.auth.models import AnonymousUser
from channels.db import database_sync_to_async
# Ensure you have djangorestframework-simplejwt installed:
from rest_framework_simplejwt.tokens import AccessToken 
from accounts.models import User # Adjust this import path if needed for your custom User model
from urllib.parse import parse_qs

@database_sync_to_async
def get_user_from_token(token_key):
    """
    Attempts to retrieve a user based on a JWT token.
    """
    try:
        # 1. Validate the token and decode the payload
        access_token = AccessToken(token_key)
        user_id = access_token.payload.get('user_id')
        
        # 2. Retrieve the user from the database
        if user_id:
            return User.objects.get(id=user_id)
    except Exception as e:
        # Token is invalid, expired, or user not found
        # print(f"Token resolution error: {e}") # Uncomment for debugging
        return AnonymousUser()
    return AnonymousUser()

class TokenAuthMiddleware:
    """
    Middleware that populates the scope 'user' key based on a token 
    in the query string (e.g., ws://.../?token=JWT_TOKEN).
    """
    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):
        # Decode the query string from bytes
        query_params = parse_qs(scope['query_string'].decode())
        token_list = query_params.get('token', [])
        
        if token_list:
            token_key = token_list[0]
            # Resolve the token to a user object and attach it to the scope
            scope['user'] = await get_user_from_token(token_key)
        else:
            # Default to AnonymousUser if no token is present
            scope['user'] = AnonymousUser()

        # Pass the scope down to the next middleware (AuthMiddlewareStack or the Consumer)
        return await self.inner(scope, receive, send)

# The final stack we export to asgi.py
def TokenAuthMiddlewareStack(inner):
    return TokenAuthMiddleware(AuthMiddlewareStack(inner))