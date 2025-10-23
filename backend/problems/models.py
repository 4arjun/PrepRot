from django.db import models
from django.conf import settings


class Problem(models.Model):
    """Problems table from ER diagram"""
    DIFFICULTY_CHOICES = [
        ('easy', 'Easy'),
        ('medium', 'Medium'),
        ('hard', 'Hard'),
    ]
    
    title = models.CharField(max_length=200)
    difficulty = models.CharField(max_length=10, choices=DIFFICULTY_CHOICES)
    topic = models.CharField(max_length=100)
    source = models.CharField(max_length=100)  # e.g., 'LeetCode', 'GeeksforGeeks'
    source_url = models.URLField(blank=True)  # Link to the problem
    company_tags = models.TextField(blank=True)  # field for company tags
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.title} ({self.difficulty})"


class SolvedProblem(models.Model):
    """solved_problems table from ER diagram - many-to-many relationship"""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    problem = models.ForeignKey(Problem, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, default='solved')  # solved, attempted, etc.
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['user', 'problem']
    
    def __str__(self):
        return f"{self.user.username} solved {self.problem.title}"