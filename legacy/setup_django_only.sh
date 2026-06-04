#!/bin/bash

echo "🚀 Setting up Algomination - Django Only Version"
echo "=================================================="

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.11+ first."
    exit 1
fi

echo "✅ Python is installed"

# Backend setup
echo ""
echo "📦 Setting up Django Backend..."
cd backend

# Create virtual environment
echo "Creating virtual environment..."
python3 -m venv venv

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Create .env file
echo "Creating environment file..."
cat > .env << EOF
DEBUG=True
SECRET_KEY=django-insecure-development-secret-key-change-in-production
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:8000,http://127.0.0.1:8000
EOF

# Run migrations
echo "Running database migrations..."
python manage.py makemigrations
python manage.py migrate

# Create superuser
echo "Creating superuser..."
echo "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.create_superuser('admin', 'admin@example.com', 'admin123') if not User.objects.filter(username='admin').exists() else None" | python manage.py shell

# Create sample algorithms
echo "Creating sample algorithms..."
python manage.py shell << EOF
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

print("Sample algorithms created successfully!")
EOF

echo "✅ Backend setup complete!"

echo ""
echo "🎉 Setup complete! Here's how to run the project:"
echo ""
echo "1. Start the Django server:"
echo "   cd backend"
echo "   source venv/bin/activate  # On Windows: venv\\Scripts\\activate"
echo "   python manage.py runserver"
echo ""
echo "2. Open your browser and go to:"
echo "   Main Site: http://localhost:8000"
echo "   Admin Panel: http://localhost:8000/admin (admin/admin123)"
echo "   API Documentation: http://localhost:8000/swagger/"
echo ""
echo "3. Sample algorithms available:"
echo "   - Bubble Sort: http://localhost:8000/algorithms/bubble-sort/"
echo "   - Binary Search: http://localhost:8000/algorithms/binary-search/"
echo "   - Quick Sort: http://localhost:8000/algorithms/quick-sort/"
echo ""
echo "Happy coding! 🚀" 