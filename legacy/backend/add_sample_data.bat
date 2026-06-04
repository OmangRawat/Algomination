@echo off
cd /d %~dp0

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Run the sample data script
echo Adding sample algorithms to the database...
python add_sample_data.py

echo.
echo ✅ Sample data added! Refresh your browser to see the algorithms.
pause 