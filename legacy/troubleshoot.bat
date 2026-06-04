@echo off
echo 🔍 Algomination Troubleshooting Script
echo =====================================

echo.
echo Checking Python installation...
python --version
if errorlevel 1 (
    echo ❌ Python is not installed or not in PATH
    echo Please install Python 3.11+ from https://python.org
    pause
    exit /b 1
)

echo ✅ Python is installed

echo.
echo Checking if we're in the right directory...
if not exist "backend" (
    echo ❌ Backend directory not found
    echo Please run this script from the project root directory
    pause
    exit /b 1
)

cd backend

echo.
echo Checking virtual environment...
if not exist "venv" (
    echo ❌ Virtual environment not found
    echo Creating virtual environment...
    python -m venv venv
)

echo.
echo Activating virtual environment...
call venv\Scripts\activate.bat

echo.
echo Checking Django installation...
python -c "import django; print('Django version:', django.get_version())"
if errorlevel 1 (
    echo ❌ Django not installed
    echo Installing Django...
    pip install django==4.2.7
)

echo.
echo Checking other dependencies...
python -c "import rest_framework; print('DRF installed')" 2>nul || (
    echo Installing Django REST Framework...
    pip install djangorestframework==3.14.0
)

python -c "import corsheaders; print('CORS headers installed')" 2>nul || (
    echo Installing Django CORS Headers...
    pip install django-cors-headers==4.3.1
)

python -c "import decouple; print('Python Decouple installed')" 2>nul || (
    echo Installing Python Decouple...
    pip install python-decouple==3.8
)

python -c "import yasg; print('DRF YASG installed')" 2>nul || (
    echo Installing DRF YASG...
    pip install drf-yasg==1.21.7
)

python -c "import PIL; print('Pillow installed')" 2>nul || (
    echo Installing Pillow...
    pip install pillow==10.1.0
)

echo.
echo Checking Django project structure...
if not exist "manage.py" (
    echo ❌ manage.py not found
    echo Creating Django project...
    django-admin startproject algomination .
)

echo.
echo Checking Django apps...
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

echo.
echo Running Django check...
python manage.py check

echo.
echo ✅ Troubleshooting complete!
echo.
echo If everything looks good, try running:
echo python manage.py runserver
echo.
pause 