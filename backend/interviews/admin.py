from django.contrib import admin
from .models import MockInterview, InterviewExperience, ReferralProfile


@admin.register(MockInterview)
class MockInterviewAdmin(admin.ModelAdmin):
    list_display = ('interviewer', 'interviewee', 'scheduled_time', 'interview_type', 'status', 'duration_minutes', 'score', 'created_at')
    list_filter = ('status', 'interview_type', 'scheduled_time', 'duration_minutes', 'created_at')
    search_fields = ('interviewer__username', 'interviewee__username', 'technical_areas', 'notes')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('Basic Information', {
            'fields': ('interviewer', 'interviewee', 'scheduled_time', 'duration_minutes')
        }),
        ('Interview Details', {
            'fields': ('interview_type', 'status', 'technical_areas', 'notes')
        }),
        ('Meeting Information', {
            'fields': ('meeting_link',)
        }),
        ('Results', {
            'fields': ('score', 'feedback')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(InterviewExperience)
class InterviewExperienceAdmin(admin.ModelAdmin):
    list_display = ('user', 'company', 'role', 'experience_type', 'outcome', 'difficulty_rating', 'date', 'created_at')
    list_filter = ('company', 'role', 'experience_type', 'outcome', 'difficulty_rating', 'date', 'is_anonymous', 'created_at')
    search_fields = ('user__username', 'company', 'role', 'round_details', 'overall_feedback')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('Basic Information', {
            'fields': ('user', 'company', 'role', 'date', 'is_anonymous')
        }),
        ('Experience Details', {
            'fields': ('experience_type', 'outcome', 'difficulty_rating', 'preparation_time')
        }),
        ('Interview Content', {
            'fields': ('round_details', 'overall_feedback', 'tips_and_advice')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(ReferralProfile)
class ReferralProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'preferred_company', 'target_role', 'experience_years', 'status', 'created_at')
    list_filter = ('preferred_company', 'status', 'experience_years', 'created_at')
    search_fields = ('user__username', 'preferred_company', 'target_role', 'key_skills')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('Basic Information', {
            'fields': ('user', 'preferred_company', 'target_role', 'status')
        }),
        ('Profile Details', {
            'fields': ('why_refer_me', 'experience_years', 'key_skills', 'achievements')
        }),
        ('Links', {
            'fields': ('resume_link', 'linkedin_profile', 'github_profile')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )