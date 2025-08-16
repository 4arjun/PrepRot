from django.urls import path
from .views import RegisterView, changeUsername, changePassword, GoogleAuthCallbackView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
    TokenBlacklistView,
)

urlpatterns = [
    path('signup/', RegisterView.as_view(), name='signup'),
    path('changeusername/', changeUsername, name='changeusername'),
    path('changepassword/', changePassword, name='changepassword'),
    path('token/login', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('token/logout/', TokenBlacklistView.as_view(), name='token_blacklist'),
    path("auth/google/", GoogleAuthCallbackView.as_view()),
]