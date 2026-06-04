@echo off
echo 🚀 Setting up Algomination - Algorithm Visualization Platform
echo ==============================================================

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed. Please install Python 3.11+ first.
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

echo ✅ Python and Node.js are installed

REM Backend setup
echo.
echo 📦 Setting up Django Backend...
cd backend

REM Create virtual environment
echo Creating virtual environment...
python -m venv venv

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install Python dependencies
echo Installing Python dependencies...
pip install -r requirements.txt

REM Create .env file
echo Creating environment file...
(
echo DEBUG=True
echo SECRET_KEY=django-insecure-development-secret-key-change-in-production
echo ALLOWED_HOSTS=localhost,127.0.0.1
echo CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
) > .env

REM Run migrations
echo Running database migrations...
python manage.py makemigrations
python manage.py migrate

REM Create superuser
echo Creating superuser...
echo from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.create_superuser('admin', 'admin@example.com', 'admin123') if not User.objects.filter(username='admin').exists() else None | python manage.py shell

echo ✅ Backend setup complete!

REM Frontend setup
echo.
echo 📦 Setting up React Frontend...
cd ..\frontend

REM Install Node.js dependencies
echo Installing Node.js dependencies...
npm install

REM Create .env file
echo Creating environment file...
(
echo VITE_API_URL=http://localhost:8000/api
echo VITE_WS_URL=ws://localhost:8000/ws
) > .env

echo ✅ Frontend setup complete!

echo.
echo 🎉 Setup complete! Here's how to run the project:
echo.
echo 1. Start the Django backend:
echo    cd backend
echo    venv\Scripts\activate
echo    python manage.py runserver
echo.
echo 2. In a new terminal, start the React frontend:
echo    cd frontend
echo    npm run dev
echo.
echo 3. Open your browser and go to:
echo    Frontend: http://localhost:3000
echo    Backend API: http://localhost:8000/api
echo    Admin Panel: http://localhost:8000/admin (admin/admin123)
echo.
echo Happy coding! 🚀
pause 