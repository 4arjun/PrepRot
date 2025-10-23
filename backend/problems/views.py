from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import Problem, SolvedProblem
from django.db.models import Q

User = get_user_model()

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_problems(request):
    """
    Get all problems with user's solved status
    """
    # Get filter parameters
    difficulty = request.GET.get('difficulty', '')
    topic = request.GET.get('topic', '')
    search = request.GET.get('search', '')
    
    # Build query
    problems = Problem.objects.all()
    
    if difficulty and difficulty != 'all':
        problems = problems.filter(difficulty=difficulty)
    
    if topic and topic != 'all':
        problems = problems.filter(topic__icontains=topic)
    
    if search:
        problems = problems.filter(
            Q(title__icontains=search) | 
            Q(company_tags__icontains=search)
        )
    
    problems = problems.order_by('created_at')
    
    # Get user's solved problems
    solved_problem_ids = set(
        SolvedProblem.objects.filter(user=request.user)
        .values_list('problem_id', flat=True)
    )
    
    # Prepare response data
    problems_data = []
    for problem in problems:
        problems_data.append({
            'id': problem.id,
            'title': problem.title,
            'difficulty': problem.difficulty,
            'topic': problem.topic,
            'source': problem.source,
            'source_url': problem.source_url,
            'company_tags': problem.company_tags,
            'is_solved': problem.id in solved_problem_ids,
            'created_at': problem.created_at
        })
    
    return Response(problems_data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_problem_solved(request, problem_id):
    """
    Mark a problem as solved or unsolved
    """
    try:
        problem = Problem.objects.get(id=problem_id)
    except Problem.DoesNotExist:
        return Response(
            {'error': 'Problem not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    
    action = request.data.get('action', 'solve')  # 'solve' or 'unsolve'
    
    if action == 'solve':
        solved_problem, created = SolvedProblem.objects.get_or_create(
            user=request.user,
            problem=problem,
            defaults={'status': 'solved'}
        )
        if not created:
            solved_problem.status = 'solved'
            solved_problem.save()
        
        return Response({
            'message': f'Problem "{problem.title}" marked as solved',
            'is_solved': True
        })
    
    elif action == 'unsolve':
        SolvedProblem.objects.filter(
            user=request.user,
            problem=problem
        ).delete()
        
        return Response({
            'message': f'Problem "{problem.title}" marked as unsolved',
            'is_solved': False
        })
    
    else:
        return Response(
            {'error': 'Invalid action. Use "solve" or "unsolve"'}, 
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_stats(request):
    """
    Get user's problem solving statistics
    """
    user_solved = SolvedProblem.objects.filter(user=request.user)
    
    # Count by difficulty
    easy_count = user_solved.filter(problem__difficulty='easy').count()
    medium_count = user_solved.filter(problem__difficulty='medium').count()
    hard_count = user_solved.filter(problem__difficulty='hard').count()
    
    # Total counts
    total_easy = Problem.objects.filter(difficulty='easy').count()
    total_medium = Problem.objects.filter(difficulty='medium').count()
    total_hard = Problem.objects.filter(difficulty='hard').count()
    
    return Response({
        'solved': {
            'easy': easy_count,
            'medium': medium_count,
            'hard': hard_count,
            'total': easy_count + medium_count + hard_count
        },
        'total': {
            'easy': total_easy,
            'medium': total_medium,
            'hard': total_hard,
            'total': total_easy + total_medium + total_hard
        }
    })