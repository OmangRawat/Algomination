#!/usr/bin/env bash
# Build step for the Django backend (used by Render and similar hosts).
set -o errexit

pip install -r requirements.txt
python manage.py collectstatic --no-input
python manage.py migrate --no-input
