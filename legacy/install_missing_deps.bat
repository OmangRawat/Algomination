@echo off
echo 🔧 Installing Missing Dependencies
echo ==================================

cd backend
call venv\Scripts\activate.bat

echo Installing missing packages...

echo Installing djangorestframework-simplejwt...
pip install djangorestframework-simplejwt==5.3.0

echo Installing other common missing packages...
pip install django-filter==23.3
pip install markdown==3.5.1

echo.
echo ✅ Dependencies installed!
echo.
echo Now you can start the server with:
echo start_server.bat
echo.
pause 