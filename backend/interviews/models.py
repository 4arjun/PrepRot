from django.db import models
from django.conf import settings


class MockInterview(models.Model):
    """mock_interviews table from ER diagram"""
    STATUS_CHOICES = [
        ('scheduled', 'Scheduled'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('no_show', 'No Show'),
    ]
    
    INTERVIEW_TYPE_CHOICES = [
        ('technical', 'Technical'),
        ('behavioral', 'Behavioral'),
        ('system_design', 'System Design'),
        ('coding', 'Coding'),
        ('mixed', 'Mixed'),
    ]
    
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
    duration_minutes = models.PositiveIntegerField(default=60, help_text="Interview duration in minutes")
    interview_type = models.CharField(max_length=20, choices=INTERVIEW_TYPE_CHOICES, default='technical')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='scheduled')
    meeting_link = models.URLField(blank=True, help_text="Video call link")
    notes = models.TextField(blank=True, help_text="Pre-interview notes or requirements")
    score = models.IntegerField(null=True, blank=True, help_text="Score out of 10")
    feedback = models.TextField(blank=True, help_text="Post-interview feedback")
    technical_areas = models.TextField(blank=True, help_text="Technical areas to focus on")
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)
    
    class Meta:
        ordering = ['-scheduled_time']
    
    def __str__(self):
        return f"Interview: {self.interviewer.username} -> {self.interviewee.username} ({self.scheduled_time.strftime('%Y-%m-%d %H:%M')})"


class InterviewExperience(models.Model):
    """interview_experiences table from ER diagram"""
    EXPERIENCE_TYPE_CHOICES = [
        ('positive', 'Positive'),
        ('neutral', 'Neutral'),
        ('negative', 'Negative'),
    ]
    
    OUTCOME_CHOICES = [
        ('selected', 'Selected'),
        ('rejected', 'Rejected'),
        ('pending', 'Pending'),
        ('withdrew', 'Withdrew'),
    ]
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    company = models.CharField(max_length=100)
    role = models.CharField(max_length=100)
    date = models.DateField()
    round_details = models.TextField()
    overall_feedback = models.TextField()
    experience_type = models.CharField(max_length=10, choices=EXPERIENCE_TYPE_CHOICES, default='neutral')
    outcome = models.CharField(max_length=10, choices=OUTCOME_CHOICES, default='pending')
    difficulty_rating = models.PositiveIntegerField(default=3, help_text="Difficulty rating from 1-5")
    preparation_time = models.PositiveIntegerField(default=0, help_text="Preparation time in weeks")
    tips_and_advice = models.TextField(blank=True, help_text="Tips for future candidates")
    is_anonymous = models.BooleanField(default=True, help_text="Share anonymously")
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.company} ({self.role}) - {self.experience_type}"


class ReferralProfile(models.Model):
    """referral_profiles table from ER diagram"""
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('hired', 'Hired'),
    ]
    
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    resume_link = models.URLField(blank=True)
    preferred_company = models.CharField(max_length=100)
    target_role = models.CharField(max_length=100, blank=True)
    why_refer_me = models.TextField(blank=True, default='', help_text="Why should someone refer you? Highlight your skills, experience, and value.")
    experience_years = models.PositiveIntegerField(default=0, help_text="Years of relevant experience")
    key_skills = models.TextField(blank=True, default='', help_text="Key technical skills (comma-separated)")
    achievements = models.TextField(blank=True, default='', help_text="Notable achievements or projects")
    linkedin_profile = models.URLField(blank=True)
    github_profile = models.URLField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)
    
    def __str__(self):
        return f"{self.user.username}'s Referral Profile - {self.preferred_company}"