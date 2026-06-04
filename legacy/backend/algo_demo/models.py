from django.db import models

class Algorithm(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    algorithm_type = models.CharField(max_length=50)
    difficulty = models.CharField(max_length=20)
    time_complexity = models.CharField(max_length=20)
    space_complexity = models.CharField(max_length=20)
    pseudocode = models.TextField()
    implementation = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']
