from django.core.management.base import BaseCommand
from problems.models import Problem

class Command(BaseCommand):
    help = 'Populate database with sample DSA problems'

    def handle(self, *args, **options):
        problems_data = [
            # Arrays
            {
                'title': 'Two Sum',
                'difficulty': 'easy',
                'topic': 'Arrays',
                'source': 'LeetCode',
                'source_url': 'https://leetcode.com/problems/two-sum/',
                'company_tags': 'Google, Amazon, Microsoft, Facebook, Apple'
            },
            {
                'title': 'Best Time to Buy and Sell Stock',
                'difficulty': 'easy',
                'topic': 'Arrays',
                'source': 'LeetCode',
                'source_url': 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/',
                'company_tags': 'Amazon, Microsoft, Google, Facebook'
            },
            {
                'title': 'Contains Duplicate',
                'difficulty': 'easy',
                'topic': 'Arrays',
                'source': 'LeetCode',
                'source_url': 'https://leetcode.com/problems/contains-duplicate/',
                'company_tags': 'Google, Amazon, Microsoft'
            },
            {
                'title': '3Sum',
                'difficulty': 'medium',
                'topic': 'Arrays',
                'source': 'LeetCode',
                'source_url': 'https://leetcode.com/problems/3sum/',
                'company_tags': 'Amazon, Microsoft, Google, Facebook, Apple'
            },
            {
                'title': 'Container With Most Water',
                'difficulty': 'medium',
                'topic': 'Arrays',
                'source': 'LeetCode',
                'source_url': 'https://leetcode.com/problems/container-with-most-water/',
                'company_tags': 'Amazon, Microsoft, Google, Facebook'
            },
            {
                'title': 'Product of Array Except Self',
                'difficulty': 'medium',
                'topic': 'Arrays',
                'source': 'LeetCode',
                'source_url': 'https://leetcode.com/problems/product-of-array-except-self/',
                'company_tags': 'Amazon, Microsoft, Google, Facebook, Apple'
            },
            {
                'title': 'Trapping Rain Water',
                'difficulty': 'hard',
                'topic': 'Arrays',
                'source': 'LeetCode',
                'source_url': 'https://leetcode.com/problems/trapping-rain-water/',
                'company_tags': 'Amazon, Microsoft, Google, Facebook, Apple'
            },
            
            # Strings
            {
                'title': 'Valid Anagram',
                'difficulty': 'easy',
                'topic': 'Strings',
                'source': 'LeetCode',
                'source_url': 'https://leetcode.com/problems/valid-anagram/',
                'company_tags': 'Amazon, Microsoft, Google'
            },
            {
                'title': 'Valid Palindrome',
                'difficulty': 'easy',
                'topic': 'Strings',
                'source': 'LeetCode',
                'source_url': 'https://leetcode.com/problems/valid-palindrome/',
                'company_tags': 'Amazon, Microsoft, Google, Facebook'
            },
            {
                'title': 'Longest Substring Without Repeating Characters',
                'difficulty': 'medium',
                'topic': 'Strings',
                'source': 'LeetCode',
                'source_url': 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
                'company_tags': 'Amazon, Microsoft, Google, Facebook, Apple'
            },
            {
                'title': 'Longest Palindromic Substring',
                'difficulty': 'medium',
                'topic': 'Strings',
                'source': 'LeetCode',
                'source_url': 'https://leetcode.com/problems/longest-palindromic-substring/',
                'company_tags': 'Amazon, Microsoft, Google, Facebook'
            },
            {
                'title': 'Minimum Window Substring',
                'difficulty': 'hard',
                'topic': 'Strings',
                'source': 'LeetCode',
                'source_url': 'https://leetcode.com/problems/minimum-window-substring/',
                'company_tags': 'Amazon, Microsoft, Google, Facebook'
            },
            
            # Linked Lists
            {
                'title': 'Reverse Linked List',
                'difficulty': 'easy',
                'topic': 'Linked Lists',
                'source': 'LeetCode',
                'source_url': 'https://leetcode.com/problems/reverse-linked-list/',
                'company_tags': 'Amazon, Microsoft, Google, Facebook, Apple'
            },
            {
                'title': 'Linked List Cycle',
                'difficulty': 'easy',
                'topic': 'Linked Lists',
                'source': 'LeetCode',
                'source_url': 'https://leetcode.com/problems/linked-list-cycle/',
                'company_tags': 'Amazon, Microsoft, Google, Facebook'
            },
            {
                'title': 'Merge Two Sorted Lists',
                'difficulty': 'easy',
                'topic': 'Linked Lists',
                'source': 'LeetCode',
                'source_url': 'https://leetcode.com/problems/merge-two-sorted-lists/',
                'company_tags': 'Amazon, Microsoft, Google, Facebook, Apple'
            },
            {
                'title': 'Remove Nth Node From End of List',
                'difficulty': 'medium',
                'topic': 'Linked Lists',
                'source': 'LeetCode',
                'source_url': 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/',
                'company_tags': 'Amazon, Microsoft, Google, Facebook'
            },
            {
                'title': 'Reorder List',
                'difficulty': 'medium',
                'topic': 'Linked Lists',
                'source': 'LeetCode',
                'source_url': 'https://leetcode.com/problems/reorder-list/',
                'company_tags': 'Amazon, Microsoft, Google, Facebook'
            },
            
            # Trees
            {
                'title': 'Maximum Depth of Binary Tree',
                'difficulty': 'easy',
                'topic': 'Trees',
                'source': 'LeetCode',
                'source_url': 'https://leetcode.com/problems/maximum-depth-of-binary-tree/',
                'company_tags': 'Amazon, Microsoft, Google, Facebook'
            },
            {
                'title': 'Same Tree',
                'difficulty': 'easy',
                'topic': 'Trees',
                'source': 'LeetCode',
                'source_url': 'https://leetcode.com/problems/same-tree/',
                'company_tags': 'Amazon, Microsoft, Google'
            },
            {
                'title': 'Invert Binary Tree',
                'difficulty': 'easy',
                'topic': 'Trees',
                'source': 'LeetCode',
                'source_url': 'https://leetcode.com/problems/invert-binary-tree/',
                'company_tags': 'Amazon, Microsoft, Google, Facebook'
            },
            {
                'title': 'Binary Tree Level Order Traversal',
                'difficulty': 'medium',
                'topic': 'Trees',
                'source': 'LeetCode',
                'source_url': 'https://leetcode.com/problems/binary-tree-level-order-traversal/',
                'company_tags': 'Amazon, Microsoft, Google, Facebook, Apple'
            },
            {
                'title': 'Validate Binary Search Tree',
                'difficulty': 'medium',
                'topic': 'Trees',
                'source': 'LeetCode',
                'source_url': 'https://leetcode.com/problems/validate-binary-search-tree/',
                'company_tags': 'Amazon, Microsoft, Google, Facebook'
            },
            {
                'title': 'Binary Tree Maximum Path Sum',
                'difficulty': 'hard',
                'topic': 'Trees',
                'source': 'LeetCode',
                'source_url': 'https://leetcode.com/problems/binary-tree-maximum-path-sum/',
                'company_tags': 'Amazon, Microsoft, Google, Facebook'
            },
            
            # Dynamic Programming
            {
                'title': 'Climbing Stairs',
                'difficulty': 'easy',
                'topic': 'Dynamic Programming',
                'source': 'LeetCode',
                'source_url': 'https://leetcode.com/problems/climbing-stairs/',
                'company_tags': 'Amazon, Microsoft, Google, Facebook'
            },
            {
                'title': 'House Robber',
                'difficulty': 'medium',
                'topic': 'Dynamic Programming',
                'source': 'LeetCode',
                'source_url': 'https://leetcode.com/problems/house-robber/',
                'company_tags': 'Amazon, Microsoft, Google'
            },
            {
                'title': 'Coin Change',
                'difficulty': 'medium',
                'topic': 'Dynamic Programming',
                'source': 'LeetCode',
                'source_url': 'https://leetcode.com/problems/coin-change/',
                'company_tags': 'Amazon, Microsoft, Google, Facebook'
            },
            {
                'title': 'Longest Increasing Subsequence',
                'difficulty': 'medium',
                'topic': 'Dynamic Programming',
                'source': 'LeetCode',
                'source_url': 'https://leetcode.com/problems/longest-increasing-subsequence/',
                'company_tags': 'Amazon, Microsoft, Google, Facebook'
            },
            {
                'title': 'Edit Distance',
                'difficulty': 'hard',
                'topic': 'Dynamic Programming',
                'source': 'LeetCode',
                'source_url': 'https://leetcode.com/problems/edit-distance/',
                'company_tags': 'Amazon, Microsoft, Google, Facebook'
            },
            
            # Graphs
            {
                'title': 'Number of Islands',
                'difficulty': 'medium',
                'topic': 'Graphs',
                'source': 'LeetCode',
                'source_url': 'https://leetcode.com/problems/number-of-islands/',
                'company_tags': 'Amazon, Microsoft, Google, Facebook'
            },
            {
                'title': 'Clone Graph',
                'difficulty': 'medium',
                'topic': 'Graphs',
                'source': 'LeetCode',
                'source_url': 'https://leetcode.com/problems/clone-graph/',
                'company_tags': 'Amazon, Microsoft, Google, Facebook'
            },
            {
                'title': 'Course Schedule',
                'difficulty': 'medium',
                'topic': 'Graphs',
                'source': 'LeetCode',
                'source_url': 'https://leetcode.com/problems/course-schedule/',
                'company_tags': 'Amazon, Microsoft, Google, Facebook'
            },
            {
                'title': 'Word Ladder',
                'difficulty': 'hard',
                'topic': 'Graphs',
                'source': 'LeetCode',
                'source_url': 'https://leetcode.com/problems/word-ladder/',
                'company_tags': 'Amazon, Microsoft, Google, Facebook'
            }
        ]
        
        created_count = 0
        updated_count = 0
        
        for problem_data in problems_data:
            problem, created = Problem.objects.get_or_create(
                title=problem_data['title'],
                defaults=problem_data
            )
            
            if created:
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f"✅ Created: {problem.title}")
                )
            else:
                # Update existing problem with new data
                for key, value in problem_data.items():
                    setattr(problem, key, value)
                problem.save()
                updated_count += 1
                self.stdout.write(
                    self.style.WARNING(f"🔄 Updated: {problem.title}")
                )
        
        self.stdout.write(
            self.style.SUCCESS(
                f"\n🎉 Successfully processed {len(problems_data)} problems:"
            )
        )
        self.stdout.write(f"   📝 Created: {created_count}")
        self.stdout.write(f"   🔄 Updated: {updated_count}")
        self.stdout.write(f"   📊 Total in database: {Problem.objects.count()}")
