from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User

# Customize the display and fields for the Custom User model in the Admin panel
class UserAdmin(BaseUserAdmin):
    # Fields displayed in the list view
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'is_admin', 'is_customer')
    # Fields to allow filtering
    list_filter = ('is_admin', 'is_customer', 'is_staff', 'is_superuser')
    
    # Custom field sets for the detail view
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email', 'phone_number', 'profile_pic')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('User Roles', {'fields': ('is_customer', 'is_admin')}),
        ('Visibility', {'fields': ('show_email', 'show_phone')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )

# Register the custom UserAdmin
admin.site.register(User, UserAdmin)