#!/usr/bin/env bash
# Build step for the Django backend (used by Render and similar hosts).
# Render's free tier has no pre-deploy/release phase, so migrations and the
# admin bootstrap run here, in the build command.
set -o errexit

pip install -r requirements.txt
python manage.py collectstatic --no-input
python manage.py migrate --no-input
python manage.py create_admin
