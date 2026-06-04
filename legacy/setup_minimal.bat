@echo off
echo 🚀 Setting up Algomination - Minimal Version
echo ===========================================

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed or not in PATH
    echo Please install Python 3.11+ from https://python.org
    pause
    exit /b 1
)

echo ✅ Python is installed

REM Backend setup
echo.
echo 📦 Setting up Django Backend...
if not exist "backend" (
    echo Creating backend directory...
    mkdir backend
)
cd backend

REM Remove existing venv if it exists
if exist "venv" (
    echo Removing existing virtual environment...
    rmdir /s /q venv
)

REM Create virtual environment
echo Creating virtual environment...
python -m venv venv
if errorlevel 1 (
    echo ❌ Failed to create virtual environment
    pause
    exit /b 1
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Upgrade pip first
echo Upgrading pip...
python -m pip install --upgrade pip

REM Install ONLY essential Django
echo Installing Django...
pip install django==4.2.7

REM Create Django project
echo Creating Django project...
django-admin startproject algomination .

REM Create simple apps
echo Creating apps...
python manage.py startapp algorithms
python manage.py startapp users

REM Create simple settings
echo Creating minimal settings...
(
echo from pathlib import Path
echo.
echo BASE_DIR = Path(__file__^).resolve().parent.parent
echo.
echo SECRET_KEY = 'django-insecure-development-key-change-in-production'
echo.
echo DEBUG = True
echo.
echo ALLOWED_HOSTS = ['localhost', '127.0.0.1']
echo.
echo INSTALLED_APPS = [
echo     'django.contrib.admin',
echo     'django.contrib.auth',
echo     'django.contrib.contenttypes',
echo     'django.contrib.sessions',
echo     'django.contrib.messages',
echo     'django.contrib.staticfiles',
echo     'algorithms',
echo     'users',
echo ]
echo.
echo MIDDLEWARE = [
echo     'django.middleware.security.SecurityMiddleware',
echo     'django.contrib.sessions.middleware.SessionMiddleware',
echo     'django.middleware.common.CommonMiddleware',
echo     'django.middleware.csrf.CsrfViewMiddleware',
echo     'django.contrib.auth.middleware.AuthenticationMiddleware',
echo     'django.contrib.messages.middleware.MessageMiddleware',
echo     'django.middleware.clickjacking.XFrameOptionsMiddleware',
echo ]
echo.
echo ROOT_URLCONF = 'algomination.urls'
echo.
echo TEMPLATES = [
echo     {
echo         'BACKEND': 'django.template.backends.django.DjangoTemplates',
echo         'DIRS': [BASE_DIR / 'templates'],
echo         'APP_DIRS': True,
echo         'OPTIONS': {
echo             'context_processors': [
echo                 'django.template.context_processors.debug',
echo                 'django.template.context_processors.request',
echo                 'django.contrib.auth.context_processors.auth',
echo                 'django.contrib.messages.context_processors.messages',
echo             ],
echo         },
echo     },
echo ]
echo.
echo WSGI_APPLICATION = 'algomination.wsgi.application'
echo.
echo DATABASES = {
echo     'default': {
echo         'ENGINE': 'django.db.backends.sqlite3',
echo         'NAME': BASE_DIR / 'db.sqlite3',
echo     }
echo }
echo.
echo AUTH_PASSWORD_VALIDATORS = [
echo     {
echo         'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
echo     },
echo     {
echo         'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
echo     },
echo     {
echo         'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
echo     },
echo     {
echo         'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
echo     },
echo ]
echo.
echo LANGUAGE_CODE = 'en-us'
echo TIME_ZONE = 'UTC'
echo USE_I18N = True
echo USE_TZ = True
echo.
echo STATIC_URL = 'static/'
echo STATICFILES_DIRS = [BASE_DIR / 'static']
echo.
echo DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
) > algomination\settings.py

REM Create simple models
echo Creating simple models...
(
echo from django.db import models
echo from django.contrib.auth.models import User
echo.
echo class Algorithm(models.Model^):
echo     name = models.CharField(max_length=200^)
echo     description = models.TextField(^)
echo     algorithm_type = models.CharField(max_length=50^)
echo     difficulty = models.CharField(max_length=20^)
echo     time_complexity = models.CharField(max_length=20^)
echo     space_complexity = models.CharField(max_length=20^)
echo     pseudocode = models.TextField(^)
echo     implementation = models.TextField(^)
echo     created_at = models.DateTimeField(auto_now_add=True^)
echo.
echo     def __str__(self^):
echo         return self.name
echo.
echo     class Meta:
echo         ordering = ['name']
) > algorithms\models.py

REM Create simple views
echo Creating simple views...
(
echo from django.shortcuts import render
echo from django.http import JsonResponse
echo from .models import Algorithm
echo.
echo def home(request^):
echo     algorithms = Algorithm.objects.all(^)
echo     return render(request, 'home.html', {'algorithms': algorithms}^)
echo.
echo def algorithm_detail(request, algorithm_id^):
echo     try:
echo         algorithm = Algorithm.objects.get(id=algorithm_id^)
echo         return render(request, 'algorithm_detail.html', {'algorithm': algorithm}^)
echo     except Algorithm.DoesNotExist:
echo         return JsonResponse({'error': 'Algorithm not found'}, status=404^)
) > algorithms\views.py

REM Create simple URLs
echo Creating simple URLs...
(
echo from django.urls import path
echo from . import views
echo.
echo urlpatterns = [
echo     path('', views.home, name='home'^),
echo     path('algorithm/<int:algorithm_id>/', views.algorithm_detail, name='algorithm_detail'^),
echo ]
) > algorithms\urls.py

REM Create main URLs
echo Creating main URLs...
(
echo from django.contrib import admin
echo from django.urls import path, include
echo.
echo urlpatterns = [
echo     path('admin/', admin.site.urls^),
echo     path('', include('algorithms.urls'^)^),
echo ]
) > algomination\urls.py

REM Create templates directory
echo Creating templates...
mkdir templates
mkdir static

REM Create simple home template
echo Creating home template...
(
echo ^<!DOCTYPE html^>
echo ^<html^>
echo ^<head^>
echo     ^<title^>Algomination - Algorithm Visualizations^</title^>
echo     ^<style^>
echo         body { font-family: Arial, sans-serif; margin: 40px; }
echo         .header { text-align: center; margin-bottom: 40px; }
echo         .algorithm { border: 1px solid #ddd; padding: 20px; margin: 10px 0; border-radius: 5px; }
echo         .algorithm h3 { color: #333; margin-top: 0; }
echo         .difficulty { background: #e9ecef; padding: 5px 10px; border-radius: 3px; display: inline-block; }
echo         .complexity { color: #666; font-size: 14px; }
echo     ^</style^>
echo ^</head^>
echo ^<body^>
echo     ^<div class="header"^>
echo         ^<h1^>🚀 Algomination^</h1^>
echo         ^<p^>Interactive Algorithm Visualizations^</p^>
echo     ^</div^>
echo     ^<div class="content"^>
echo         ^<h2^>Available Algorithms^</h2^>
echo         {% for algorithm in algorithms %}
echo         ^<div class="algorithm"^>
echo             ^<h3^>^<a href="{% url 'algorithm_detail' algorithm.id %}"^>{{ algorithm.name }}^</a^>^</h3^>
echo             ^<p^>{{ algorithm.description }}^</p^>
echo             ^<span class="difficulty"^>{{ algorithm.difficulty }}^</span^>
echo             ^<div class="complexity"^>
echo                 Time: {{ algorithm.time_complexity }} | Space: {{ algorithm.space_complexity }}
echo             ^</div^>
echo         ^</div^>
echo         {% empty %}
echo         ^<p^>No algorithms available yet.^</p^>
echo         {% endfor %}
echo     ^</div^>
echo ^</body^>
echo ^</html^>
) > templates\home.html

REM Create algorithm detail template
echo Creating algorithm detail template...
(
echo ^<!DOCTYPE html^>
echo ^<html^>
echo ^<head^>
echo     ^<title^>{{ algorithm.name }} - Algomination^</title^>
echo     ^<style^>
echo         body { font-family: Arial, sans-serif; margin: 40px; }
echo         .header { margin-bottom: 30px; }
echo         .back-link { color: #007bff; text-decoration: none; }
echo         .algorithm-info { background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0; }
echo         .code-block { background: #f1f3f4; padding: 15px; border-radius: 5px; font-family: monospace; white-space: pre-wrap; }
echo         .complexity { display: inline-block; margin: 10px 10px 10px 0; padding: 5px 10px; background: #e9ecef; border-radius: 3px; }
echo     ^</style^>
echo ^</head^>
echo ^<body^>
echo     ^<div class="header"^>
echo         ^<a href="{% url 'home' %}" class="back-link"^>← Back to Algorithms^</a^>
echo         ^<h1^>{{ algorithm.name }}^</h1^>
echo     ^</div^>
echo     ^<div class="algorithm-info"^>
echo         ^<p^><strong^>Type:^</strong^> {{ algorithm.algorithm_type }}^</p^>
echo         ^<p^><strong^>Difficulty:^</strong^> {{ algorithm.difficulty }}^</p^>
echo         ^<div class="complexity"^>Time: {{ algorithm.time_complexity }}^</div^>
echo         ^<div class="complexity"^>Space: {{ algorithm.space_complexity }}^</div^>
echo     ^</div^>
echo     ^<div^>
echo         ^<h2^>Description^</h2^>
echo         ^<p^>{{ algorithm.description }}^</p^>
echo     ^</div^>
echo     ^<div^>
echo         ^<h2^>Pseudocode^</h2^>
echo         ^<div class="code-block"^>{{ algorithm.pseudocode }}^</div^>
echo     ^</div^>
echo     ^<div^>
echo         ^<h2^>Implementation^</h2^>
echo         ^<div class="code-block"^>{{ algorithm.implementation }}^</div^>
echo     ^</div^>
echo ^</body^>
echo ^</html^>
) > templates\algorithm_detail.html

REM Run migrations
echo Running migrations...
python manage.py makemigrations
python manage.py migrate

REM Create superuser
echo Creating superuser...
python manage.py shell -c "from django.contrib.auth.models import User; User.objects.create_superuser('admin', 'admin@example.com', 'admin123') if not User.objects.filter(username='admin').exists() else None"

REM Create admin configuration
echo Creating admin configuration...
(
echo from django.contrib import admin
echo from .models import Algorithm
echo.
echo @admin.register(Algorithm^)
echo class AlgorithmAdmin(admin.ModelAdmin^):
echo     list_display = ('name', 'algorithm_type', 'difficulty', 'created_at'^)
echo     list_filter = ('algorithm_type', 'difficulty'^)
echo     search_fields = ('name', 'description'^)
) > algorithms\admin.py

REM Create sample algorithm
echo Creating sample algorithm...
python manage.py shell -c "
from algorithms.models import Algorithm
if not Algorithm.objects.filter(name='Bubble Sort').exists():
    Algorithm.objects.create(
        name='Bubble Sort',
        description='A simple comparison-based sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
        algorithm_type='sorting',
        difficulty='beginner',
        time_complexity='O(n²)',
        space_complexity='O(1)',
        pseudocode='''procedure bubbleSort(A : list of sortable items)
    n := length(A)
    repeat
        swapped := false
        for i := 1 to n - 1 inclusive do
            if A[i-1] > A[i] then
                swap(A[i-1], A[i])
                swapped := true
            end if
        end for
        n := n - 1
    until not swapped
end procedure''',
        implementation='''def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr'''
    )
    print('Sample algorithm created!')
"

echo ✅ Minimal setup complete!

echo.
echo 🎉 Setup complete! Here's how to run the project:
echo.
echo 1. Start the Django server:
echo    cd backend
echo    venv\Scripts\activate
echo    python manage.py runserver
echo.
echo 2. Open your browser and go to:
echo    Main Site: http://localhost:8000
echo    Admin Panel: http://localhost:8000/admin (admin/admin123)
echo.
echo 3. Sample algorithm available:
echo    - Bubble Sort: http://localhost:8000/algorithm/1/
echo.
echo Happy coding! 🚀
pause 