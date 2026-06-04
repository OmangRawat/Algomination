"""
Creates a superuser from environment variables on first run.
Safe to call on every deploy — skips silently if the user already exists.

Required env vars:
    DJANGO_ADMIN_EMAIL
    DJANGO_ADMIN_PASSWORD
"""

import os
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand


class Command(BaseCommand):

    def handle(self, *args, **options):
        User = get_user_model()
        email = os.getenv("DJANGO_ADMIN_EMAIL")
        password = os.getenv("DJANGO_ADMIN_PASSWORD")

        if not email or not password:
            self.stdout.write("DJANGO_ADMIN_EMAIL / DJANGO_ADMIN_PASSWORD not set — skipping.")
            return

        if User.objects.filter(email=email).exists():
            self.stdout.write(f"Admin {email} already exists — skipping.")
            return

        User.objects.create_superuser(email=email, password=password)
        self.stdout.write(self.style.SUCCESS(f"Superuser {email} created."))
