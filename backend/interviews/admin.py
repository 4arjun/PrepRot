from django.contrib import admin
from .models import MockInterview, InterviewExperience, ReferralProfile


@admin.register(MockInterview)
class MockInterviewAdmin(admin.ModelAdmin):
    list_display = ('interviewer', 'interviewee', 'scheduled_time', 'score')
    list_filter = ('scheduled_time', 'score')
    search_fields = ('interviewer__username', 'interviewee__username')


@admin.register(InterviewExperience)
class InterviewExperienceAdmin(admin.ModelAdmin):
    list_display = ('user', 'company', 'role', 'date')
    list_filter = ('company', 'role', 'date')
    search_fields = ('user__username', 'company', 'role')


@admin.register(ReferralProfile)
class ReferralProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'preferred_company', 'status')
    list_filter = ('preferred_company', 'status')
    search_fields = ('user__username', 'preferred_company')