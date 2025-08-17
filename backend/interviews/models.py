from django.db import models
from django.conf import settings


class MockInterview(models.Model):
    """mock_interviews table from ER diagram"""
    interviewer = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='interviews_conducted'
    )
    interviewee = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='interviews_taken'
    )
    scheduled_time = models.DateTimeField()
    score = models.IntegerField(null=True, blank=True)
    feedback = models.TextField(blank=True)
    
    def __str__(self):
        return f"Interview: {self.interviewer.username} -> {self.interviewee.username}"


class InterviewExperience(models.Model):
    """interview_experiences table from ER diagram"""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    company = models.CharField(max_length=100)
    role = models.CharField(max_length=100)
    date = models.DateField()
    round_details = models.TextField()
    overall_feedback = models.TextField()
    
    def __str__(self):
        return f"{self.user.username} - {self.company} ({self.role})"


class ReferralProfile(models.Model):
    """referral_profiles table from ER diagram"""
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    resume_link = models.URLField()
    preferred_company = models.CharField(max_length=100)
    status = models.CharField(max_length=20, default='active') # active inactive, hired
    
    def __str__(self):
        return f"{self.user.username}'s Referral Profile"