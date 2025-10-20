from django.core.management.base import BaseCommand
from accounts.views import get_leetcode_stats, calculate_leetcode_score

class Command(BaseCommand):
    help = 'Test LeetCode API functionality'

    def add_arguments(self, parser):
        parser.add_argument('username', type=str, help='LeetCode username to test')

    def handle(self, *args, **options):
        username = options['username']
        
        self.stdout.write(f"🔍 Fetching LeetCode stats for: {username}")
        
        stats = get_leetcode_stats(username)
        
        if not stats:
            self.stdout.write(
                self.style.ERROR(f"❌ Could not fetch stats for {username}")
            )
            return
        
        self.stdout.write(
            self.style.SUCCESS(f"✅ Successfully fetched stats for {username}")
        )
        
        self.stdout.write(f"\n📊 Problem Stats:")
        self.stdout.write(f"Easy: {stats['Easy']}")
        self.stdout.write(f"Medium: {stats['Medium']}")
        self.stdout.write(f"Hard: {stats['Hard']}")
        
        score = calculate_leetcode_score(stats['Easy'], stats['Medium'], stats['Hard'])
        self.stdout.write(f"\n🏆 Calculated Score: {score}")
        self.stdout.write(f"Formula: ({stats['Easy']} × 1) + ({stats['Medium']} × 2) + ({stats['Hard']} × 3) = {score}")
