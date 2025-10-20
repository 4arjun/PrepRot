from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializer import RegisterSerializer
from .models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
import requests
from google.oauth2 import id_token
from google.auth.transport import requests as grequests
from rest_framework_simplejwt.tokens import RefreshToken


class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST']) 
@permission_classes([IsAuthenticated])
def changeUsername(request):
    try:
        new_username = request.data.get('username')
        
        
        if User.objects.filter(username=new_username).exclude(id=request.user.id).exists():
            return Response(
                {"error": "Username already exists"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = request.user
        user.username = new_username
        user.save()
        
        return Response(
            {"message": "Username changed successfully", "new_username": new_username}, 
            status=status.HTTP_200_OK
        )
        
    except Exception as e:
        return Response(
            {"error": "An error occurred while changing username"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST']) 
@permission_classes([IsAuthenticated])
def changePassword(request):
    try:
        new_password = request.data.get('password')
        
        user = request.user
        user.set_password(new_password)
        user.save()
        
        return Response(
            {"message": "Password changed successfully"}, 
            status=status.HTTP_200_OK
        )
        
    except Exception as e:
        return Response(
            {"error": "An error occurred while changing password"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
 




class GoogleAuthCallbackView(APIView):
    permission_classes = []  

    def post(self, request):
        code = request.data.get("code")
        if not code:
            return Response({"detail": "Missing code"}, status=400)
        

        data = {
            "code": code,
            "client_id": settings.GOOGLE_OAUTH2_CLIENT_ID,
            "client_secret": settings.GOOGLE_OAUTH2_CLIENT_SECRET,
            "redirect_uri": settings.GOOGLE_OAUTH2_REDIRECT_URI,
            "grant_type": "authorization_code",
        }
        token_resp = requests.post(settings.GOOGLE_TOKEN_ENDPOINT, data=data)
        if token_resp.status_code != 200:
            return Response({"detail": "Failed to get token"}, status=400)

        id_token_str = token_resp.json().get("id_token")
        if not id_token_str:
            return Response({"detail": "No ID token"}, status=400)

        try:
            claims = id_token.verify_oauth2_token(
                id_token_str,
                grequests.Request(),
                settings.GOOGLE_OAUTH2_CLIENT_ID
            )
        except ValueError:
            return Response({"detail": "Invalid ID token"}, status=400)

        email = claims.get("email")
        full_name = claims.get("name", "")
        first_name = claims.get("given_name") or (full_name.split()[0] if full_name else "")
        last_name = claims.get("family_name") or (" ".join(full_name.split()[1:]) if full_name and len(full_name.split()) > 1 else "")
        if not email:
            return Response({"detail": "No email in token"}, status=400)

        try:
            user = User.objects.get(email=email)
            created = False
        except User.DoesNotExist:
            username_base = email.split("@")[0]
            username = username_base
            counter = 1
            while User.objects.filter(username=username).exists():
                username = f"{username_base}{counter}"
                counter += 1
            user = User.objects.create(
                username=username,
                email=email,
                first_name=first_name,
                last_name=last_name
            )
            user.set_unusable_password()
            user.save()
            created = True

        refresh = RefreshToken.for_user(user)
        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "created": created,
            "user": {"id": user.id, "username": user.username, "email": user.email}
        })


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
def get_user_profile(request):
    """
    Get current user's profile information
    """
    user = request.user
    return Response({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'college': user.college,
        'role': user.role,
        'leetcode_username': user.leetcode_username,
        'leetcode_score': user.leetcode_score
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_leetcode_username(request):
    """
    Update user's LeetCode username, college and fetch/calculate their score
    """
    leetcode_username = request.data.get('leetcode_username', '').strip()
    college = request.data.get('college', '').strip()
    
    if not leetcode_username:
        return Response(
            {'error': 'LeetCode username is required'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if not college:
        return Response(
            {'error': 'College name is required'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Check if username is already taken by another user
    if User.objects.filter(leetcode_username=leetcode_username).exclude(id=request.user.id).exists():
        return Response(
            {'error': 'This LeetCode username is already connected to another account'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Fetch LeetCode stats
    stats = get_leetcode_stats(leetcode_username)
    if not stats:
        return Response(
            {'error': 'Could not fetch stats for this LeetCode username. Please check if the username is correct.'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Calculate score
    new_score = calculate_leetcode_score(stats["Easy"], stats["Medium"], stats["Hard"])
    
    # Update user
    user = request.user
    user.leetcode_username = leetcode_username
    user.college = college
    user.leetcode_score = new_score
    user.save()
    
    return Response({
        'message': 'Profile updated successfully',
        'leetcode_username': leetcode_username,
        'college': college,
        'leetcode_score': new_score,
        'stats': stats
    })