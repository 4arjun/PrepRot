from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    """Extended User model based on ER diagram"""
    role = models.CharField(max_length=50, blank=True)
    leetcode_score = models.IntegerField(default=0)
    leetcode_username = models.CharField(max_length=50, unique=True, null=True, blank=True)
    college = models.CharField(max_length=100, blank=True)
    
    def __str__(self):
        return self.username
