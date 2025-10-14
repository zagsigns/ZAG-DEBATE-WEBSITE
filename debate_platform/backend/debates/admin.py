from django.contrib import admin
from .models import Debate, Message

@admin.register(Debate)
class DebateAdmin(admin.ModelAdmin):
    list_display = ('title', 'creator', 'subscription_fee', 'participant_count', 'commission_due', 'created_at')
    list_filter = ('created_at', 'subscription_fee')
    search_fields = ('title', 'creator__username')
    readonly_fields = ('commission_due',)
    
    def participant_count(self, obj):
        return obj.participants.count()
    participant_count.short_description = 'Participants'
    
@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('debate', 'user', 'content_snippet', 'timestamp')
    list_filter = ('debate', 'timestamp')
    search_fields = ('user__username', 'content')
    
    def content_snippet(self, obj):
        return obj.content[:50] + '...' if len(obj.content) > 50 else obj.content
    content_snippet.short_description = 'Content'