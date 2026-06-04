Write-Host "🚀 Starting Algomination Django Server" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

# Change to backend directory
Set-Location backend

# Activate virtual environment using batch file
Write-Host "Activating virtual environment..." -ForegroundColor Yellow
& "venv\Scripts\activate.bat"

# Check if Django is installed
Write-Host "Checking Django installation..." -ForegroundColor Yellow
try {
    python -c "import django; print('Django version:', django.get_version())"
} catch {
    Write-Host "❌ Django not found. Installing Django..." -ForegroundColor Red
    pip install django==4.2.7
    pip install djangorestframework==3.14.0
    pip install django-cors-headers==4.3.1
    pip install python-decouple==3.8
    pip install drf-yasg==1.21.7
}

Write-Host ""
Write-Host "Starting Django development server..." -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Cyan
Write-Host ""

# Start the server
python manage.py runserver 