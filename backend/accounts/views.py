from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializer import RegisterSerializer
from django.contrib.auth.models import User
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