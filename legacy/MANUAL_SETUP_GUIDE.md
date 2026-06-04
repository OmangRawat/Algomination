# Manual Setup Guide - Fixing Import Errors

If you're encountering import errors when running the setup script, follow this manual guide:

## Prerequisites

1. **Python 3.11+** installed
2. **Git** (optional, for version control)

## Step-by-Step Setup

### 1. Create Project Structure

```bash
# Create the main project directory
mkdir algomination-modern
cd algomination-modern

# Create backend directory
mkdir backend
cd backend
```

### 2. Set Up Virtual Environment

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

### 3. Install Dependencies

```bash
# Install Django and other requirements
pip install django==4.2.7
pip install djangorestframework==3.14.0
pip install django-cors-headers==4.3.1
pip install python-decouple==3.8
pip install drf-yasg==1.21.7
pip install pillow==10.1.0

# Or install from requirements.txt if available
pip install -r requirements.txt
```

### 4. Create Django Project

```bash
# Create Django project
django-admin startproject algomination .

# Create apps
python manage.py startapp users
python manage.py startapp algorithms
python manage.py startapp api
```

### 5. Configure Settings

Edit `algomination/settings.py` and add the apps to `INSTALLED_APPS`:

```python
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'drf_yasg',
    'users',
    'algorithms',
    'api',
]
```

### 6. Create Models

Create the model files as provided in the project structure.

### 7. Run Migrations

```bash
# Make migrations
python manage.py makemigrations users
python manage.py makemigrations algorithms
python manage.py makemigrations api

# Apply migrations
python manage.py migrate
```

### 8. Create Superuser

```bash
python manage.py createsuperuser
```

### 9. Create Sample Data

Run the Django shell to create sample algorithms:

```bash
python manage.py shell
```

Then paste the sample data creation code from the setup script.

### 10. Run the Server

```bash
python manage.py runserver
```

## Common Import Errors and Solutions

### Error: "No module named 'django'"
**Solution**: Make sure your virtual environment is activated and Django is installed.

### Error: "No module named 'rest_framework'"
**Solution**: Install Django REST Framework:
```bash
pip install djangorestframework
```

### Error: "No module named 'corsheaders'"
**Solution**: Install Django CORS Headers:
```bash
pip install django-cors-headers
```

### Error: "No module named 'drf_yasg'"
**Solution**: Install DRF YASG:
```bash
pip install drf-yasg
```

### Error: "No module named 'PIL'"
**Solution**: Install Pillow:
```bash
pip install pillow
```

## Alternative: Use the Fixed Setup Scripts

If you prefer automated setup, use the fixed scripts:

- **Linux/macOS**: `bash setup_django_only_fixed.sh`
- **Windows**: `setup_django_only_fixed.bat`

## Troubleshooting

### If you get permission errors:
```bash
# On Linux/macOS
chmod +x setup_django_only_fixed.sh
```

### If virtual environment activation fails:
```bash
# On Windows, try:
venv\Scripts\activate.bat

# On Linux/macOS, try:
source venv/bin/activate
```

### If pip install fails:
```bash
# Upgrade pip first
python -m pip install --upgrade pip

# Then install requirements
pip install -r requirements.txt
```

## Next Steps

After successful setup:

1. Visit http://localhost:8000 for the main site
2. Visit http://localhost:8000/admin for the admin panel
3. Visit http://localhost:8000/swagger/ for API documentation

## Support

If you continue to have issues:

1. Check that Python 3.11+ is installed: `python --version`
2. Ensure virtual environment is activated (you should see `(venv)` in your terminal)
3. Verify all dependencies are installed: `pip list`
4. Check Django is working: `python manage.py check` 