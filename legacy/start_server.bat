@echo off
echo 🚀 Starting Algomination Django Server
echo =====================================

cd backend

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Checking Django installation...
python -c "import django; print('Django version:', django.get_version())"

if errorlevel 1 (
    echo ❌ Django not found. Installing Django...
    pip install django==4.2.7
    pip install djangorestframework==3.14.0
    pip install django-cors-headers==4.3.1
    pip install python-decouple==3.8
    pip install drf-yasg==1.21.7
    pip install djangorestframework-simplejwt==5.3.0
    pip install django-filter==23.3
    pip install markdown==3.5.1
)

echo.
echo Starting Django development server...
echo Press Ctrl+C to stop the server
echo.
python manage.py runserver

pause 