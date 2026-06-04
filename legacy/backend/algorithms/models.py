from django.db import models
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _

User = get_user_model()


class Algorithm(models.Model):
    """Model for storing algorithm information."""
    
    ALGORITHM_TYPES = [
        ('sorting', 'Sorting'),
        ('searching', 'Searching'),
        ('data_structure', 'Data Structure'),
        ('pathfinding', 'Pathfinding'),
        ('other', 'Other'),
    ]
    
    DIFFICULTY_LEVELS = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
    ]
    
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    algorithm_type = models.CharField(max_length=20, choices=ALGORITHM_TYPES)
    difficulty = models.CharField(max_length=15, choices=DIFFICULTY_LEVELS)
    time_complexity = models.CharField(max_length=50)
    space_complexity = models.CharField(max_length=50)
    pseudocode = models.TextField()
    implementation = models.TextField(help_text="Python implementation")
    visualization_config = models.JSONField(default=dict)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['name']
    
    def __str__(self):
        return self.name


class Project(models.Model):
    """Model for user-submitted projects."""
    
    STATUS_CHOICES = [
        ('pending', 'Pending Review'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='projects')
    title = models.CharField(max_length=200)
    description = models.TextField()
    algorithm = models.ForeignKey(Algorithm, on_delete=models.CASCADE, related_name='projects')
    github_url = models.URLField()
    live_url = models.URLField(blank=True)
    technologies_used = models.JSONField(default=list)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    review_notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title


class UserSubmission(models.Model):
    """Model for user algorithm submissions."""
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='submissions')
    algorithm = models.ForeignKey(Algorithm, on_delete=models.CASCADE, related_name='submissions')
    input_data = models.JSONField()
    output_data = models.JSONField()
    execution_time = models.FloatField(help_text="Execution time in milliseconds")
    memory_usage = models.FloatField(help_text="Memory usage in MB")
    steps = models.JSONField(help_text="Animation steps")
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.email} - {self.algorithm.name}"


class Contact(models.Model):
    """Model for contact form submissions."""
    
    name = models.CharField(max_length=100)
    email = models.EmailField()
    subject = models.CharField(max_length=200)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} - {self.subject}"


class Feedback(models.Model):
    """Model for user feedback."""
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='feedback', null=True, blank=True)
    algorithm = models.ForeignKey(Algorithm, on_delete=models.CASCADE, related_name='feedback')
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        unique_together = ['user', 'algorithm']
    
    def __str__(self):
        return f"{self.user.email if self.user else 'Anonymous'} - {self.algorithm.name}" 