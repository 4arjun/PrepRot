from django.urls import path
from .views import (
    get_referral_profile, 
    create_or_update_referral_profile, 
    delete_referral_profile,
    get_referral_stats,
    get_interview_experiences,
    create_interview_experience,
    get_my_interview_experiences,
    update_interview_experience,
    delete_interview_experience,
    get_experience_stats,
    get_mock_interviews,
    create_mock_interview,
    get_available_interviewers,
    update_mock_interview,
    cancel_mock_interview,
    get_interview_stats
)

urlpatterns = [
    # Referral Profile URLs
    path('referral-profile/', get_referral_profile, name='get_referral_profile'),
    path('referral-profile/create/', create_or_update_referral_profile, name='create_update_referral_profile'),
    path('referral-profile/delete/', delete_referral_profile, name='delete_referral_profile'),
    path('referral-stats/', get_referral_stats, name='referral_stats'),
    
    # Interview Experience URLs
    path('experiences/', get_interview_experiences, name='get_interview_experiences'),
    path('experiences/create/', create_interview_experience, name='create_interview_experience'),
    path('experiences/my/', get_my_interview_experiences, name='get_my_interview_experiences'),
    path('experiences/<int:experience_id>/update/', update_interview_experience, name='update_interview_experience'),
    path('experiences/<int:experience_id>/delete/', delete_interview_experience, name='delete_interview_experience'),
    path('experiences/stats/', get_experience_stats, name='get_experience_stats'),
    
    # Mock Interview URLs
    path('mock-interviews/', get_mock_interviews, name='get_mock_interviews'),
    path('mock-interviews/create/', create_mock_interview, name='create_mock_interview'),
    path('mock-interviews/interviewers/', get_available_interviewers, name='get_available_interviewers'),
    path('mock-interviews/<int:interview_id>/update/', update_mock_interview, name='update_mock_interview'),
    path('mock-interviews/<int:interview_id>/cancel/', cancel_mock_interview, name='cancel_mock_interview'),
    path('mock-interviews/stats/', get_interview_stats, name='get_interview_stats'),
]
