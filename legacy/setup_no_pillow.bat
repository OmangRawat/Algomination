@echo off
setlocal enabledelayedexpansion

echo 🚀 Setting up Algomination - Without Pillow (Image Handling)
echo ===========================================================

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
    echo Please ensure Python 3.11+ is installed
    pause
    exit /b 1
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat
if errorlevel 1 (
    echo ❌ Failed to activate virtual environment
    pause
    exit /b 1
)

REM Upgrade pip first
echo Upgrading pip...
python -m pip install --upgrade pip

REM Install Python dependencies one by one with error checking
echo Installing Python dependencies...

echo Installing Django...
pip install django==4.2.7
if errorlevel 1 (
    echo ❌ Failed to install Django
    pause
    exit /b 1
)

echo Installing Django REST Framework...
pip install djangorestframework==3.14.0
if errorlevel 1 (
    echo ❌ Failed to install Django REST Framework
    pause
    exit /b 1
)

echo Installing Django CORS Headers...
pip install django-cors-headers==4.3.1
if errorlevel 1 (
    echo ❌ Failed to install Django CORS Headers
    pause
    exit /b 1
)

echo Installing Python Decouple...
pip install python-decouple==3.8
if errorlevel 1 (
    echo ❌ Failed to install Python Decouple
    pause
    exit /b 1
)

echo Installing DRF YASG...
pip install drf-yasg==1.21.7
if errorlevel 1 (
    echo ❌ Failed to install DRF YASG
    pause
    exit /b 1
)

echo Installing DRF Simple JWT...
pip install djangorestframework-simplejwt==5.3.0
if errorlevel 1 (
    echo ❌ Failed to install DRF Simple JWT
    pause
    exit /b 1
)

echo Installing Django Filter...
pip install django-filter==23.3
if errorlevel 1 (
    echo ❌ Failed to install Django Filter
    pause
    exit /b 1
)

echo Installing Markdown...
pip install markdown==3.5.1
if errorlevel 1 (
    echo ❌ Failed to install Markdown
    pause
    exit /b 1
)

echo ⚠️  Skipping Pillow installation (image handling will be limited)
echo    To install Pillow later, you may need Visual Studio Build Tools
echo    or try: pip install --only-binary=all pillow

echo ✅ Core dependencies installed successfully!

REM Create .env file
echo Creating environment file...
(
echo DEBUG=True
echo SECRET_KEY=django-insecure-development-secret-key-change-in-production
echo ALLOWED_HOSTS=localhost,127.0.0.1
echo CORS_ALLOWED_ORIGINS=http://localhost:8000,http://127.0.0.1:8000
) > .env

REM Create missing template directories
echo Creating template directories...
if not exist "algomination\templates\algomination" mkdir "algomination\templates\algomination"
if not exist "static" mkdir "static"

REM Check if Django project exists, if not create it
if not exist "manage.py" (
    echo Creating Django project...
    django-admin startproject algomination .
    if errorlevel 1 (
        echo ❌ Failed to create Django project
        pause
        exit /b 1
    )
)

REM Check if apps exist, if not create them
if not exist "users" (
    echo Creating users app...
    python manage.py startapp users
)

if not exist "algorithms" (
    echo Creating algorithms app...
    python manage.py startapp algorithms
)

if not exist "api" (
    echo Creating api app...
    python manage.py startapp api
)

REM Run migrations
echo Running database migrations...
python manage.py makemigrations users
python manage.py makemigrations algorithms
python manage.py makemigrations api
python manage.py migrate

REM Create superuser
echo Creating superuser...
python manage.py shell -c "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.create_superuser('admin', 'admin@example.com', 'admin123') if not User.objects.filter(username='admin').exists() else None"

echo ✅ Backend setup complete!

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
echo ⚠️  Note: Image upload features will be limited without Pillow
echo    To add image support later, install Visual Studio Build Tools
echo    and run: pip install pillow
echo.
echo Happy coding! 🚀
pause 