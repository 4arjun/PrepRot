from django.urls import path
from .views import (
    RegisterView, changeUsername, changePassword, GoogleAuthCallbackView,
    get_user_profile, update_leetcode_username
)
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
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('token/logout/', TokenBlacklistView.as_view(), name='token_blacklist'),
    path("auth/google/", GoogleAuthCallbackView.as_view()),
    path('user/profile/', get_user_profile, name='user_profile'),
    path('user/update-leetcode/', update_leetcode_username, name='update_leetcode'),
]