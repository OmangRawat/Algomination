from django.db import models


class TimeStamped(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        abstract = True
        ordering = ["-created_at"]


class Opinion(TimeStamped):
    """General feedback / opinion submitted from the contact page."""

    name = models.CharField(max_length=120)
    email = models.EmailField()
    message = models.TextField()

    def __str__(self):
        return f"Opinion from {self.name}"


class Project(TimeStamped):
    """A community-submitted algorithm visualization project."""

    name = models.CharField(max_length=120)
    algorithm = models.CharField(max_length=120)
    github_url = models.URLField()
    email = models.EmailField()

    def __str__(self):
        return f"{self.algorithm} by {self.name}"


class ContactMessage(TimeStamped):
    """A direct contact message."""

    name = models.CharField(max_length=120)
    email = models.EmailField()
    message = models.TextField()

    def __str__(self):
        return f"Message from {self.name}"
