@echo off
cd /d %~dp0
cd backend

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Install Django if not present
pip show django >nul 2>&1
if errorlevel 1 (
    echo Installing Django...
    pip install django
) else (
    echo Django already installed.
)

REM Run migrations
echo Running makemigrations...
python manage.py makemigrations

echo Running migrate...
python manage.py migrate

echo Starting Django development server...
python manage.py runserver 