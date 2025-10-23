from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from django.db.models import Q, Count, Avg
from .models import ReferralProfile, InterviewExperience, MockInterview
from datetime import datetime, timedelta
from django.utils import timezone

User = get_user_model()

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_referral_profile(request):
    """
    Get current user's referral profile
    """
    try:
        profile = ReferralProfile.objects.get(user=request.user)
        return Response({
            'id': profile.id,
            'preferred_company': profile.preferred_company,
            'target_role': profile.target_role,
            'why_refer_me': profile.why_refer_me,
            'experience_years': profile.experience_years,
            'key_skills': profile.key_skills,
            'achievements': profile.achievements,
            'resume_link': profile.resume_link,
            'linkedin_profile': profile.linkedin_profile,
            'github_profile': profile.github_profile,
            'status': profile.status,
            'created_at': profile.created_at,
            'updated_at': profile.updated_at
        })
    except ReferralProfile.DoesNotExist:
        return Response(
            {'message': 'No referral profile found'}, 
            status=status.HTTP_404_NOT_FOUND
        )

@api_view(['POST', 'PUT'])
@permission_classes([IsAuthenticated])
def create_or_update_referral_profile(request):
    """
    Create or update user's referral profile
    """
    data = request.data
    
    # Validate required fields
    required_fields = ['preferred_company', 'why_refer_me']
    for field in required_fields:
        if not data.get(field, '').strip():
            return Response(
                {'error': f'{field.replace("_", " ").title()} is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
    
    try:
        # Try to get existing profile
        profile = ReferralProfile.objects.get(user=request.user)
        # Update existing profile
        profile.preferred_company = data.get('preferred_company', profile.preferred_company)
        profile.target_role = data.get('target_role', profile.target_role)
        profile.why_refer_me = data.get('why_refer_me', profile.why_refer_me)
        profile.experience_years = data.get('experience_years', profile.experience_years)
        profile.key_skills = data.get('key_skills', profile.key_skills)
        profile.achievements = data.get('achievements', profile.achievements)
        profile.resume_link = data.get('resume_link', profile.resume_link)
        profile.linkedin_profile = data.get('linkedin_profile', profile.linkedin_profile)
        profile.github_profile = data.get('github_profile', profile.github_profile)
        profile.status = data.get('status', profile.status)
        profile.save()
        
        message = 'Referral profile updated successfully'
        
    except ReferralProfile.DoesNotExist:
        # Create new profile
        profile = ReferralProfile.objects.create(
            user=request.user,
            preferred_company=data.get('preferred_company'),
            target_role=data.get('target_role', ''),
            why_refer_me=data.get('why_refer_me'),
            experience_years=data.get('experience_years', 0),
            key_skills=data.get('key_skills', ''),
            achievements=data.get('achievements', ''),
            resume_link=data.get('resume_link', ''),
            linkedin_profile=data.get('linkedin_profile', ''),
            github_profile=data.get('github_profile', ''),
            status=data.get('status', 'active')
        )
        
        message = 'Referral profile created successfully'
    
    return Response({
        'message': message,
        'profile': {
            'id': profile.id,
            'preferred_company': profile.preferred_company,
            'target_role': profile.target_role,
            'why_refer_me': profile.why_refer_me,
            'experience_years': profile.experience_years,
            'key_skills': profile.key_skills,
            'achievements': profile.achievements,
            'resume_link': profile.resume_link,
            'linkedin_profile': profile.linkedin_profile,
            'github_profile': profile.github_profile,
            'status': profile.status,
            'created_at': profile.created_at,
            'updated_at': profile.updated_at
        }
    })

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_referral_profile(request):
    """
    Delete user's referral profile
    """
    try:
        profile = ReferralProfile.objects.get(user=request.user)
        profile.delete()
        return Response({'message': 'Referral profile deleted successfully'})
    except ReferralProfile.DoesNotExist:
        return Response(
            {'error': 'No referral profile found'}, 
            status=status.HTTP_404_NOT_FOUND
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_referral_stats(request):
    """
    Get referral statistics (for admin/analytics purposes)
    """
    total_profiles = ReferralProfile.objects.count()
    active_profiles = ReferralProfile.objects.filter(status='active').count()
    hired_profiles = ReferralProfile.objects.filter(status='hired').count()
    
    # Top companies
    from django.db.models import Count
    top_companies = ReferralProfile.objects.values('preferred_company').annotate(
        count=Count('preferred_company')
    ).order_by('-count')[:10]
    
    return Response({
        'total_profiles': total_profiles,
        'active_profiles': active_profiles,
        'hired_profiles': hired_profiles,
        'top_companies': list(top_companies)
    })

# Interview Experience APIs

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_interview_experiences(request):
    """
    Get all interview experiences with filtering
    """
    # Get filter parameters
    company = request.GET.get('company', '')
    role = request.GET.get('role', '')
    experience_type = request.GET.get('experience_type', '')
    search = request.GET.get('search', '')
    
    # Build query
    experiences = InterviewExperience.objects.all()
    
    if company and company != 'all':
        experiences = experiences.filter(company__icontains=company)
    
    if role and role != 'all':
        experiences = experiences.filter(role__icontains=role)
    
    if experience_type and experience_type != 'all':
        experiences = experiences.filter(experience_type=experience_type)
    
    if search:
        experiences = experiences.filter(
            Q(company__icontains=search) | 
            Q(role__icontains=search) |
            Q(round_details__icontains=search) |
            Q(overall_feedback__icontains=search) |
            Q(tips_and_advice__icontains=search)
        )
    
    # Prepare response data
    experiences_data = []
    for exp in experiences:
        experiences_data.append({
            'id': exp.id,
            'company': exp.company,
            'role': exp.role,
            'date': exp.date,
            'round_details': exp.round_details,
            'overall_feedback': exp.overall_feedback,
            'experience_type': exp.experience_type,
            'outcome': exp.outcome,
            'difficulty_rating': exp.difficulty_rating,
            'preparation_time': exp.preparation_time,
            'tips_and_advice': exp.tips_and_advice,
            'is_anonymous': exp.is_anonymous,
            'author': 'Anonymous' if exp.is_anonymous else exp.user.username,
            'created_at': exp.created_at,
            'is_own': exp.user == request.user
        })
    
    return Response(experiences_data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_interview_experience(request):
    """
    Create a new interview experience
    """
    data = request.data
    
    # Validate required fields
    required_fields = ['company', 'role', 'date', 'round_details', 'overall_feedback']
    for field in required_fields:
        if not data.get(field, '').strip():
            return Response(
                {'error': f'{field.replace("_", " ").title()} is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
    
    try:
        # Parse date
        interview_date = datetime.strptime(data['date'], '%Y-%m-%d').date()
        
        # Create experience
        experience = InterviewExperience.objects.create(
            user=request.user,
            company=data['company'],
            role=data['role'],
            date=interview_date,
            round_details=data['round_details'],
            overall_feedback=data['overall_feedback'],
            experience_type=data.get('experience_type', 'neutral'),
            outcome=data.get('outcome', 'pending'),
            difficulty_rating=int(data.get('difficulty_rating', 3)),
            preparation_time=int(data.get('preparation_time', 0)),
            tips_and_advice=data.get('tips_and_advice', ''),
            is_anonymous=data.get('is_anonymous', True)
        )
        
        return Response({
            'message': 'Interview experience created successfully',
            'experience': {
                'id': experience.id,
                'company': experience.company,
                'role': experience.role,
                'date': experience.date,
                'experience_type': experience.experience_type,
                'outcome': experience.outcome,
                'difficulty_rating': experience.difficulty_rating,
                'created_at': experience.created_at
            }
        })
        
    except ValueError as e:
        return Response(
            {'error': 'Invalid date format. Use YYYY-MM-DD'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        return Response(
            {'error': 'Failed to create experience'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_my_interview_experiences(request):
    """
    Get current user's interview experiences
    """
    experiences = InterviewExperience.objects.filter(user=request.user)
    
    experiences_data = []
    for exp in experiences:
        experiences_data.append({
            'id': exp.id,
            'company': exp.company,
            'role': exp.role,
            'date': exp.date,
            'round_details': exp.round_details,
            'overall_feedback': exp.overall_feedback,
            'experience_type': exp.experience_type,
            'outcome': exp.outcome,
            'difficulty_rating': exp.difficulty_rating,
            'preparation_time': exp.preparation_time,
            'tips_and_advice': exp.tips_and_advice,
            'is_anonymous': exp.is_anonymous,
            'created_at': exp.created_at,
            'updated_at': exp.updated_at
        })
    
    return Response(experiences_data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_interview_experience(request, experience_id):
    """
    Update user's own interview experience
    """
    try:
        experience = InterviewExperience.objects.get(id=experience_id, user=request.user)
    except InterviewExperience.DoesNotExist:
        return Response(
            {'error': 'Experience not found or not authorized'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    
    data = request.data
    
    # Update fields
    experience.company = data.get('company', experience.company)
    experience.role = data.get('role', experience.role)
    
    if data.get('date'):
        try:
            experience.date = datetime.strptime(data['date'], '%Y-%m-%d').date()
        except ValueError:
            return Response(
                {'error': 'Invalid date format. Use YYYY-MM-DD'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
    
    experience.round_details = data.get('round_details', experience.round_details)
    experience.overall_feedback = data.get('overall_feedback', experience.overall_feedback)
    experience.experience_type = data.get('experience_type', experience.experience_type)
    experience.outcome = data.get('outcome', experience.outcome)
    experience.difficulty_rating = int(data.get('difficulty_rating', experience.difficulty_rating))
    experience.preparation_time = int(data.get('preparation_time', experience.preparation_time))
    experience.tips_and_advice = data.get('tips_and_advice', experience.tips_and_advice)
    experience.is_anonymous = data.get('is_anonymous', experience.is_anonymous)
    
    experience.save()
    
    return Response({'message': 'Experience updated successfully'})

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_interview_experience(request, experience_id):
    """
    Delete user's own interview experience
    """
    try:
        experience = InterviewExperience.objects.get(id=experience_id, user=request.user)
        experience.delete()
        return Response({'message': 'Experience deleted successfully'})
    except InterviewExperience.DoesNotExist:
        return Response(
            {'error': 'Experience not found or not authorized'}, 
            status=status.HTTP_404_NOT_FOUND
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_experience_stats(request):
    """
    Get interview experience statistics
    """
    total_experiences = InterviewExperience.objects.count()
    
    # Experience type breakdown
    experience_types = InterviewExperience.objects.values('experience_type').annotate(
        count=Count('experience_type')
    )
    
    # Top companies
    top_companies = InterviewExperience.objects.values('company').annotate(
        count=Count('company')
    ).order_by('-count')[:10]
    
    # Average difficulty rating
    avg_difficulty = InterviewExperience.objects.aggregate(
        avg_difficulty=Avg('difficulty_rating')
    )['avg_difficulty'] or 0
    
    # Outcome breakdown
    outcomes = InterviewExperience.objects.values('outcome').annotate(
        count=Count('outcome')
    )
    
    return Response({
        'total_experiences': total_experiences,
        'experience_types': list(experience_types),
        'top_companies': list(top_companies),
        'average_difficulty': round(avg_difficulty, 1),
        'outcomes': list(outcomes)
    })

# Mock Interview APIs

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_mock_interviews(request):
    """
    Get mock interviews for the current user (both as interviewer and interviewee)
    """
    user = request.user
    
    # Get interviews where user is either interviewer or interviewee
    interviews = MockInterview.objects.filter(
        Q(interviewer=user) | Q(interviewee=user)
    ).select_related('interviewer', 'interviewee')
    
    interviews_data = []
    for interview in interviews:
        interviews_data.append({
            'id': interview.id,
            'interviewer': {
                'id': interview.interviewer.id,
                'username': interview.interviewer.username,
                'is_me': interview.interviewer == user
            },
            'interviewee': {
                'id': interview.interviewee.id,
                'username': interview.interviewee.username,
                'is_me': interview.interviewee == user
            },
            'scheduled_time': interview.scheduled_time,
            'duration_minutes': interview.duration_minutes,
            'interview_type': interview.interview_type,
            'status': interview.status,
            'meeting_link': interview.meeting_link,
            'notes': interview.notes,
            'score': interview.score,
            'feedback': interview.feedback,
            'technical_areas': interview.technical_areas,
            'created_at': interview.created_at,
            'role': 'interviewer' if interview.interviewer == user else 'interviewee'
        })
    
    return Response(interviews_data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_mock_interview(request):
    """
    Create a new mock interview (user becomes the interviewee)
    """
    data = request.data
    
    # Validate required fields
    required_fields = ['interviewer_id', 'scheduled_time', 'interview_type']
    for field in required_fields:
        if not data.get(field):
            return Response(
                {'error': f'{field.replace("_", " ").title()} is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
    
    try:
        # Get interviewer
        interviewer = User.objects.get(id=data['interviewer_id'])
        
        # Parse scheduled time
        scheduled_time = datetime.fromisoformat(data['scheduled_time'].replace('Z', '+00:00'))
        
        # Check if interviewer is available at this time
        existing_interview = MockInterview.objects.filter(
            interviewer=interviewer,
            scheduled_time__date=scheduled_time.date(),
            scheduled_time__hour=scheduled_time.hour,
            status__in=['scheduled', 'in_progress']
        ).exists()
        
        if existing_interview:
            return Response(
                {'error': 'Interviewer is not available at this time'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create interview
        interview = MockInterview.objects.create(
            interviewer=interviewer,
            interviewee=request.user,
            scheduled_time=scheduled_time,
            duration_minutes=int(data.get('duration_minutes', 60)),
            interview_type=data['interview_type'],
            notes=data.get('notes', ''),
            technical_areas=data.get('technical_areas', ''),
            meeting_link=data.get('meeting_link', '')
        )
        
        return Response({
            'message': 'Mock interview scheduled successfully',
            'interview': {
                'id': interview.id,
                'interviewer': interviewer.username,
                'scheduled_time': interview.scheduled_time,
                'interview_type': interview.interview_type,
                'duration_minutes': interview.duration_minutes
            }
        })
        
    except User.DoesNotExist:
        return Response(
            {'error': 'Interviewer not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except ValueError as e:
        return Response(
            {'error': 'Invalid date format'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        return Response(
            {'error': 'Failed to create interview'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_available_interviewers(request):
    """
    Get list of available interviewers (users who can conduct interviews)
    """
    # For now, return all users except the current user
    # In a real system, you might have a specific role or qualification system
    interviewers = User.objects.exclude(id=request.user.id).values('id', 'username', 'first_name', 'last_name')
    
    return Response(list(interviewers))

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_mock_interview(request, interview_id):
    """
    Update mock interview (only interviewer can update status, score, feedback)
    """
    try:
        interview = MockInterview.objects.get(id=interview_id)
        
        # Check permissions
        if interview.interviewer != request.user and interview.interviewee != request.user:
            return Response(
                {'error': 'Not authorized to update this interview'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        data = request.data
        
        # Interviewers can update status, score, feedback
        if interview.interviewer == request.user:
            if 'status' in data:
                interview.status = data['status']
            if 'score' in data:
                interview.score = int(data['score']) if data['score'] else None
            if 'feedback' in data:
                interview.feedback = data['feedback']
            if 'meeting_link' in data:
                interview.meeting_link = data['meeting_link']
        
        # Both can update notes and technical areas before the interview
        if interview.status == 'scheduled':
            if 'notes' in data:
                interview.notes = data['notes']
            if 'technical_areas' in data:
                interview.technical_areas = data['technical_areas']
        
        interview.save()
        
        return Response({'message': 'Interview updated successfully'})
        
    except MockInterview.DoesNotExist:
        return Response(
            {'error': 'Interview not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': 'Failed to update interview'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def cancel_mock_interview(request, interview_id):
    """
    Cancel mock interview (both interviewer and interviewee can cancel)
    """
    try:
        interview = MockInterview.objects.get(id=interview_id)
        
        # Check permissions
        if interview.interviewer != request.user and interview.interviewee != request.user:
            return Response(
                {'error': 'Not authorized to cancel this interview'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Can only cancel scheduled interviews
        if interview.status != 'scheduled':
            return Response(
                {'error': 'Can only cancel scheduled interviews'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        interview.status = 'cancelled'
        interview.save()
        
        return Response({'message': 'Interview cancelled successfully'})
        
    except MockInterview.DoesNotExist:
        return Response(
            {'error': 'Interview not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_interview_stats(request):
    """
    Get interview statistics for the current user
    """
    user = request.user
    
    # Interviews as interviewee
    as_interviewee = MockInterview.objects.filter(interviewee=user)
    interviewee_stats = {
        'total': as_interviewee.count(),
        'completed': as_interviewee.filter(status='completed').count(),
        'scheduled': as_interviewee.filter(status='scheduled').count(),
        'cancelled': as_interviewee.filter(status='cancelled').count(),
    }
    
    # Interviews as interviewer
    as_interviewer = MockInterview.objects.filter(interviewer=user)
    interviewer_stats = {
        'total': as_interviewer.count(),
        'completed': as_interviewer.filter(status='completed').count(),
        'scheduled': as_interviewer.filter(status='scheduled').count(),
        'cancelled': as_interviewer.filter(status='cancelled').count(),
    }
    
    # Average score received
    completed_interviews = as_interviewee.filter(status='completed', score__isnull=False)
    avg_score = completed_interviews.aggregate(avg_score=Avg('score'))['avg_score'] or 0
    
    return Response({
        'as_interviewee': interviewee_stats,
        'as_interviewer': interviewer_stats,
        'average_score': round(avg_score, 1) if avg_score else 0
    })