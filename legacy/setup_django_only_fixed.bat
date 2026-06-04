@echo off
echo 🚀 Setting up Algomination - Django Only Version (Fixed)
echo =========================================================

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed. Please install Python 3.11+ first.
    pause
    exit /b 1
)

echo ✅ Python is installed

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
pip install django==4.2.7
pip install djangorestframework==3.14.0
pip install django-cors-headers==4.3.1
pip install python-decouple==3.8
pip install drf-yasg==1.21.7
pip install pillow==10.1.0

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

REM Run migrations
echo Running database migrations...
python manage.py makemigrations users
python manage.py makemigrations algorithms
python manage.py makemigrations api
python manage.py migrate

REM Create superuser
echo Creating superuser...
python manage.py shell -c "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.create_superuser('admin', 'admin@example.com', 'admin123') if not User.objects.filter(username='admin').exists() else None"

REM Create sample algorithms
echo Creating sample algorithms...
python manage.py shell -c "
from algorithms.models import Algorithm

# Create sample algorithms if they don't exist
if not Algorithm.objects.filter(name='Bubble Sort').exists():
    Algorithm.objects.create(
        name='Bubble Sort',
        slug='bubble-sort',
        description='A simple comparison-based sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
        algorithm_type='sorting',
        difficulty='beginner',
        time_complexity='O(n²)',
        space_complexity='O(1)',
        pseudocode='''procedure bubbleSort(A : list of sortable items)
    n := length(A)
    repeat
        swapped := false
        for i := 1 to n - 1 inclusive do
            if A[i-1] > A[i] then
                swap(A[i-1], A[i])
                swapped := true
            end if
        end for
        n := n - 1
    until not swapped
end procedure''',
        implementation='''def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr'''
    )
    print('Bubble Sort created!')

if not Algorithm.objects.filter(name='Binary Search').exists():
    Algorithm.objects.create(
        name='Binary Search',
        slug='binary-search',
        description='An efficient search algorithm that finds the position of a target value within a sorted array.',
        algorithm_type='searching',
        difficulty='beginner',
        time_complexity='O(log n)',
        space_complexity='O(1)',
        pseudocode='''function binary_search(A, n, T):
    L := 0
    R := n − 1
    while L ≤ R:
        m := floor((L + R) / 2)
        if A[m] < T:
            L := m + 1
        else if A[m] > T:
            R := m − 1
        else:
            return m
    return unsuccessful''',
        implementation='''def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1'''
    )
    print('Binary Search created!')

if not Algorithm.objects.filter(name='Quick Sort').exists():
    Algorithm.objects.create(
        name='Quick Sort',
        slug='quick-sort',
        description='A highly efficient, comparison-based sorting algorithm that uses a divide-and-conquer strategy.',
        algorithm_type='sorting',
        difficulty='intermediate',
        time_complexity='O(n log n)',
        space_complexity='O(log n)',
        pseudocode='''algorithm quicksort(A, lo, hi) is
    if lo < hi then
        p := partition(A, lo, hi)
        quicksort(A, lo, p - 1)
        quicksort(A, p + 1, hi)

algorithm partition(A, lo, hi) is
    pivot := A[hi]
    i := lo - 1
    for j := lo to hi - 1 do
        if A[j] ≤ pivot then
            i := i + 1
            swap A[i] with A[j]
    swap A[i + 1] with A[hi]
    return i + 1''',
        implementation='''def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    
    return quick_sort(left) + middle + quick_sort(right)'''
    )
    print('Quick Sort created!')

print('Sample algorithms created successfully!')
"

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
echo    API Documentation: http://localhost:8000/swagger/
echo.
echo 3. Sample algorithms available:
echo    - Bubble Sort: http://localhost:8000/algorithms/bubble-sort/
echo    - Binary Search: http://localhost:8000/algorithms/binary-search/
echo    - Quick Sort: http://localhost:8000/algorithms/quick-sort/
echo.
echo Happy coding! 🚀
pause 