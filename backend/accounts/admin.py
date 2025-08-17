from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    # Add the new fields to the admin interface
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Additional Info', {
            'fields': ('role', 'leetcode_score', 'leetcode_username', 'college')
        }),
    )
    
    # Use default readonly fields
    readonly_fields = BaseUserAdmin.readonly_fields
    
    # Add new fields to the list display
    list_display = BaseUserAdmin.list_display + ('role', 'college', 'leetcode_score')
    
    # Add filters for new fields
    list_filter = BaseUserAdmin.list_filter + ('role', 'college')
    
    # Add search functionality for new fields
    search_fields = BaseUserAdmin.search_fields + ('leetcode_username', 'college')