from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
import requests
import json

User = get_user_model()

def get_leetcode_stats(username):
    """
    Fetch LeetCode stats using GraphQL API
    Returns: dict with easy, medium, hard problem counts or None if error
    """
    url = "https://leetcode.com/graphql"
    query = """
    query userProfile($username: String!) {
      matchedUser(username: $username) {
        username
        submitStats {
          acSubmissionNum {
            difficulty
            count
          }
        }
      }
    }
    """
    
    variables = {"username": username}
    
    try:
        response = requests.post(url, json={"query": query, "variables": variables}, timeout=10)
        
        if response.status_code != 200:
            return None
            
        data = response.json()
        
        # Check if user exists
        if not data.get("data") or not data["data"].get("matchedUser"):
            return None
            
        # Extract stats
        stats = data["data"]["matchedUser"]["submitStats"]["acSubmissionNum"]
        
        # Convert to dict for easier access
        result = {"Easy": 0, "Medium": 0, "Hard": 0}
        for item in stats:
            difficulty = item["difficulty"]
            count = item["count"]
            if difficulty in result:
                result[difficulty] = count
                
        return result
        
    except Exception as e:
        print(f"Error fetching LeetCode stats for {username}: {str(e)}")
        return None

def calculate_leetcode_score(easy, medium, hard):
    """
    Calculate weighted LeetCode score: Easy×1 + Medium×2 + Hard×3
    """
    return (easy * 1) + (medium * 2) + (hard * 3)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_leaderboard(request):
    """
    Get college-specific leaderboard based on user's college
    """
    user_college = request.user.college
    
    if not user_college:
        # If user has no college, show all users
        users = User.objects.filter(
            leetcode_username__isnull=False
        ).exclude(
            leetcode_username=""
        ).order_by('-leetcode_score')
    else:
        # Show only users from same college
        users = User.objects.filter(
            college=user_college,
            leetcode_username__isnull=False
        ).exclude(
            leetcode_username=""
        ).order_by('-leetcode_score')
    
    leaderboard_data = []
    for user in users:
        leaderboard_data.append({
            'id': user.id,
            'username': user.username,
            'leetcode_username': user.leetcode_username,
            'leetcode_score': user.leetcode_score,
            'college': user.college
        })
    
    return Response(leaderboard_data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def refresh_all_scores(request):
    """
    Refresh LeetCode scores for all users with LeetCode usernames
    """
    users_with_leetcode = User.objects.filter(
        leetcode_username__isnull=False
    ).exclude(leetcode_username="")
    
    updated_count = 0
    failed_count = 0
    
    for user in users_with_leetcode:
        stats = get_leetcode_stats(user.leetcode_username)
        if stats:
            new_score = calculate_leetcode_score(
                stats["Easy"], 
                stats["Medium"], 
                stats["Hard"]
            )
            user.leetcode_score = new_score
            user.save()
            updated_count += 1
        else:
            failed_count += 1
    
    return Response({
        'message': f'Updated {updated_count} users, {failed_count} failed',
        'updated': updated_count,
        'failed': failed_count
    })