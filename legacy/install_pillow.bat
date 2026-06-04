@echo off
echo 🔧 Installing Pillow (Image Processing Library)
echo ===============================================

echo.
echo This script will try to install Pillow using pre-compiled binaries
echo to avoid compilation issues on Windows.
echo.

cd backend
call venv\Scripts\activate.bat

echo Attempting to install Pillow with pre-compiled binaries...
pip install --only-binary=all pillow

if errorlevel 1 (
    echo.
    echo ❌ Failed to install Pillow with pre-compiled binaries
    echo.
    echo Alternative solutions:
    echo 1. Install Visual Studio Build Tools:
    echo    - Download from: https://visualstudio.microsoft.com/visual-cpp-build-tools/
    echo    - Install "C++ build tools" workload
    echo    - Then run: pip install pillow
    echo.
    echo 2. Use a different image library:
    echo    pip install python-magic
    echo.
    echo 3. Skip image features for now (project will still work)
    echo.
    echo The project will work without Pillow, but image upload features
    echo will be limited.
) else (
    echo.
    echo ✅ Pillow installed successfully!
    echo Image processing features are now available.
)

echo.
pause 