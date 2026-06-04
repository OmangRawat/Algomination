@echo off
echo 🚀 Starting Algomination Django Server
echo ======================================

REM Check if backend directory exists
if not exist "backend" (
    echo ❌ Backend directory not found!
    echo Please run setup_simple.bat first
    pause
    exit /b 1
)

REM Navigate to backend
cd backend

REM Check if virtual environment exists
if not exist "venv" (
    echo ❌ Virtual environment not found!
    echo Please run setup_simple.bat first
    pause
    exit /b 1
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Check if Django is installed
python -c "import django" >nul 2>&1
if errorlevel 1 (
    echo ❌ Django not found in virtual environment!
    echo Please run setup_simple.bat first
    pause
    exit /b 1
)

echo ✅ Django found!

REM Start Django development server
echo.
echo 🌐 Starting Django development server...
echo 📍 Server will be available at: http://localhost:8000
echo 📍 Admin panel: http://localhost:8000/admin
echo.
echo Press Ctrl+C to stop the server
echo.

python manage.py runserver 