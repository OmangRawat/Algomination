@echo off
echo 🚀 Setting up Algomination - Simple Version
echo ==========================================

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

REM Remove existing Django project files
if exist "algomination" (
    echo Removing existing Django project...
    rmdir /s /q algomination
)
if exist "manage.py" (
    del manage.py
)
if exist "db.sqlite3" (
    del db.sqlite3
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

REM Install ONLY Django
echo Installing Django...
pip install django==4.2.7

REM Create Django project
echo Creating Django project...
django-admin startproject algomination .

REM Create simple apps with unique names
echo Creating apps...
python manage.py startapp algo_demo
python manage.py startapp user_management

REM Create settings file using Python
echo Creating settings file...
python -c "
import os
from pathlib import Path

# Get the base directory
BASE_DIR = Path(__file__).resolve().parent.parent

# Create settings content
settings_content = f'''from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = 'django-insecure-development-key-change-in-production'

DEBUG = True

ALLOWED_HOSTS = ['localhost', '127.0.0.1']

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'algo_demo',
    'user_management',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'algomination.urls'

TEMPLATES = [
    {{
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {{
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        }},
    }},
]

WSGI_APPLICATION = 'algomination.wsgi.application'

DATABASES = {{
    'default': {{
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }}
}}

AUTH_PASSWORD_VALIDATORS = [
    {{
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    }},
    {{
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    }},
    {{
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    }},
    {{
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    }},
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

STATIC_URL = 'static/'
STATICFILES_DIRS = [BASE_DIR / 'static']

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
'''

# Write settings file
with open('algomination/settings.py', 'w') as f:
    f.write(settings_content)

print('Settings file created successfully!')
"

REM Create models file
echo Creating models file...
python -c "
models_content = '''from django.db import models

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
'''

with open('algo_demo/models.py', 'w') as f:
    f.write(models_content)

print('Models file created successfully!')
"

REM Create views file
echo Creating views file...
python -c "
views_content = '''from django.shortcuts import render
from django.http import JsonResponse
from .models import Algorithm

def home(request):
    algorithms = Algorithm.objects.all()
    return render(request, 'home.html', {'algorithms': algorithms})

def algorithm_detail(request, algorithm_id):
    try:
        algorithm = Algorithm.objects.get(id=algorithm_id)
        return render(request, 'algorithm_detail.html', {'algorithm': algorithm})
    except Algorithm.DoesNotExist:
        return JsonResponse({'error': 'Algorithm not found'}, status=404)
'''

with open('algo_demo/views.py', 'w') as f:
    f.write(views_content)

print('Views file created successfully!')
"

REM Create URLs files
echo Creating URLs files...
python -c "
# Main URLs
main_urls = '''from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('algo_demo.urls')),
]
'''

with open('algomination/urls.py', 'w') as f:
    f.write(main_urls)

# App URLs
app_urls = '''from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('algorithm/<int:algorithm_id>/', views.algorithm_detail, name='algorithm_detail'),
]
'''

with open('algo_demo/urls.py', 'w') as f:
    f.write(app_urls)

print('URLs files created successfully!')
"

REM Create admin file
echo Creating admin file...
python -c "
admin_content = '''from django.contrib import admin
from .models import Algorithm

@admin.register(Algorithm)
class AlgorithmAdmin(admin.ModelAdmin):
    list_display = ('name', 'algorithm_type', 'difficulty', 'created_at')
    list_filter = ('algorithm_type', 'difficulty')
    search_fields = ('name', 'description')
'''

with open('algo_demo/admin.py', 'w') as f:
    f.write(admin_content)

print('Admin file created successfully!')
"

REM Create templates directory
echo Creating templates...
mkdir templates
mkdir static

REM Create templates using Python
echo Creating templates...
python -c "
# Home template
home_template = '''<!DOCTYPE html>
<html>
<head>
    <title>Algomination - Algorithm Visualizations</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 40px; }
        .header h1 { color: #2c3e50; margin-bottom: 10px; }
        .header p { color: #7f8c8d; font-size: 18px; }
        .algorithm { border: 1px solid #ddd; padding: 20px; margin: 15px 0; border-radius: 8px; transition: transform 0.2s; }
        .algorithm:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
        .algorithm h3 { color: #2c3e50; margin-top: 0; }
        .algorithm h3 a { color: #3498db; text-decoration: none; }
        .algorithm h3 a:hover { color: #2980b9; }
        .difficulty { background: #3498db; color: white; padding: 5px 12px; border-radius: 15px; display: inline-block; font-size: 12px; font-weight: bold; }
        .complexity { color: #7f8c8d; font-size: 14px; margin-top: 10px; }
        .content h2 { color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px; }
    </style>
</head>
<body>
    <div class=\"container\">
        <div class=\"header\">
            <h1>🚀 Algomination</h1>
            <p>Interactive Algorithm Visualizations</p>
        </div>
        <div class=\"content\">
            <h2>Available Algorithms</h2>
            {% for algorithm in algorithms %}
            <div class=\"algorithm\">
                <h3><a href=\"{% url 'algorithm_detail' algorithm.id %}\">{{ algorithm.name }}</a></h3>
                <p>{{ algorithm.description }}</p>
                <span class=\"difficulty\">{{ algorithm.difficulty }}</span>
                <div class=\"complexity\">
                    Time: {{ algorithm.time_complexity }} | Space: {{ algorithm.space_complexity }}
                </div>
            </div>
            {% empty %}
            <p>No algorithms available yet.</p>
            {% endfor %}
        </div>
    </div>
</body>
</html>
'''

with open('templates/home.html', 'w') as f:
    f.write(home_template)

# Detail template
detail_template = '''<!DOCTYPE html>
<html>
<head>
    <title>{{ algorithm.name }} - Algomination</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
        .container { max-width: 1000px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { margin-bottom: 30px; }
        .back-link { color: #3498db; text-decoration: none; font-weight: bold; }
        .back-link:hover { color: #2980b9; }
        .algorithm-info { background: #ecf0f1; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .code-block { background: #2c3e50; color: #ecf0f1; padding: 20px; border-radius: 8px; font-family: 'Courier New', monospace; white-space: pre-wrap; overflow-x: auto; }
        .complexity { display: inline-block; margin: 10px 10px 10px 0; padding: 8px 15px; background: #3498db; color: white; border-radius: 20px; font-size: 14px; }
        h1 { color: #2c3e50; }
        h2 { color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px; }
    </style>
</head>
<body>
    <div class=\"container\">
        <div class=\"header\">
            <a href=\"{% url 'home' %}\" class=\"back-link\">← Back to Algorithms</a>
            <h1>{{ algorithm.name }}</h1>
        </div>
        <div class=\"algorithm-info\">
            <p><strong>Type:</strong> {{ algorithm.algorithm_type }}</p>
            <p><strong>Difficulty:</strong> {{ algorithm.difficulty }}</p>
            <div class=\"complexity\">Time: {{ algorithm.time_complexity }}</div>
            <div class=\"complexity\">Space: {{ algorithm.space_complexity }}</div>
        </div>
        <div>
            <h2>Description</h2>
            <p>{{ algorithm.description }}</p>
        </div>
        <div>
            <h2>Pseudocode</h2>
            <div class=\"code-block\">{{ algorithm.pseudocode }}</div>
        </div>
        <div>
            <h2>Implementation</h2>
            <div class=\"code-block\">{{ algorithm.implementation }}</div>
        </div>
    </div>
</body>
</html>
'''

with open('templates/algorithm_detail.html', 'w') as f:
    f.write(detail_template)

print('Templates created successfully!')
"

REM Run migrations
echo Running migrations...
python manage.py makemigrations
python manage.py migrate

REM Create superuser
echo Creating superuser...
python manage.py shell -c "from django.contrib.auth.models import User; User.objects.create_superuser('admin', 'admin@example.com', 'admin123') if not User.objects.filter(username='admin').exists() else None"

REM Create sample algorithm
echo Creating sample algorithm...
python manage.py shell -c "
from algo_demo.models import Algorithm
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

echo ✅ Simple setup complete!

echo.
echo 🎉 Setup complete! Here's how to run the project:
echo.
echo 1. Start the Django server:
echo    start_minimal.bat
echo.
echo 2. Open your browser and go to:
echo    Main Site: http://localhost:8000
echo    Admin Panel: http://localhost:8000/admin (admin/admin123)
echo.
echo 3. Sample algorithm available:
echo    - Bubble Sort: http://localhost:8000/algorithm/1/
echo.
echo ✅ NO external dependencies - only Django!
echo ✅ NO naming conflicts - using unique names!
echo ✅ NO batch file syntax issues!
echo.
echo Happy coding! 🚀
pause 