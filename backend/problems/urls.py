from django.urls import path
from .views import get_problems, mark_problem_solved, get_user_stats

urlpatterns = [
    path('', get_problems, name='problems_list'),
    path('<int:problem_id>/solve/', mark_problem_solved, name='mark_problem_solved'),
    path('stats/', get_user_stats, name='user_problem_stats'),
]
