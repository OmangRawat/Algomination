"""
Creates one or more superusers from environment variables on every deploy.
Idempotent — existing users are skipped, so it's safe to run repeatedly.

Env vars:
    DJANGO_ADMIN_EMAIL     One email, or a comma-separated list of emails.
                           A single entry may use "email:password" to give that
                           admin its own password.
    DJANGO_ADMIN_PASSWORD  Default password for any email without its own.

Examples:
    DJANGO_ADMIN_EMAIL = "me@x.com"
    DJANGO_ADMIN_EMAIL = "me@x.com, you@y.com"                 (shared password)
    DJANGO_ADMIN_EMAIL = "me@x.com:pass1, you@y.com:pass2"     (per-admin passwords)
"""

import os
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand


class Command(BaseCommand):

    def handle(self, *args, **options):
        User = get_user_model()
        raw = os.getenv("DJANGO_ADMIN_EMAIL", "")
        default_password = os.getenv("DJANGO_ADMIN_PASSWORD")

        entries = [e.strip() for e in raw.split(",") if e.strip()]
        if not entries:
            self.stdout.write("DJANGO_ADMIN_EMAIL not set — skipping.")
            return

        for entry in entries:
            # Allow an optional per-admin password: "email:password".
            if ":" in entry:
                email, password = entry.split(":", 1)
                email, password = email.strip(), password.strip()
            else:
                email, password = entry, default_password

            if not password:
                self.stdout.write(
                    f"No password for {email} (set DJANGO_ADMIN_PASSWORD) — skipping."
                )
                continue

            if User.objects.filter(email=email).exists():
                self.stdout.write(f"Admin {email} already exists — skipping.")
                continue

            User.objects.create_superuser(email=email, password=password)
            self.stdout.write(self.style.SUCCESS(f"Superuser {email} created."))
