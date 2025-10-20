from django.urls import path
from .views import get_leaderboard, refresh_all_scores

urlpatterns = [
    path('', get_leaderboard, name='leaderboard'),
    path('refresh-scores/', refresh_all_scores, name='refresh_scores'),
]
