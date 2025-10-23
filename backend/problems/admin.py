from django.contrib import admin
from .models import Problem, SolvedProblem


@admin.register(Problem)
class ProblemAdmin(admin.ModelAdmin):
    list_display = ('title', 'difficulty', 'topic', 'source', 'created_at')
    list_filter = ('difficulty', 'topic', 'source', 'created_at')
    search_fields = ('title', 'topic', 'company_tags')
    readonly_fields = ('created_at',)
    fields = ('title', 'difficulty', 'topic', 'source', 'source_url', 'company_tags', 'created_at')


@admin.register(SolvedProblem)
class SolvedProblemAdmin(admin.ModelAdmin):
    list_display = ('user', 'problem', 'status', 'timestamp')
    list_filter = ('status', 'timestamp', 'problem__difficulty')
    search_fields = ('user__username', 'problem__title')
    readonly_fields = ('timestamp',)