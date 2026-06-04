#!/usr/bin/env python
import os
import sys
import django

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'algomination.settings')
django.setup()

from algo_demo.models import Algorithm

def create_sample_algorithms():
    """Create sample algorithm data"""
    
    # Check if algorithms already exist
    if Algorithm.objects.exists():
        print("Sample algorithms already exist!")
        return
    
    algorithms_data = [
        {
            'name': 'Bubble Sort',
            'description': 'A simple comparison-based sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
            'algorithm_type': 'sorting',
            'difficulty': 'beginner',
            'time_complexity': 'O(n²)',
            'space_complexity': 'O(1)',
            'pseudocode': '''procedure bubbleSort(A : list of sortable items)
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
            'implementation': '''def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr'''
        },
        {
            'name': 'Quick Sort',
            'description': 'A highly efficient, comparison-based sorting algorithm that uses a divide-and-conquer strategy to sort elements.',
            'algorithm_type': 'sorting',
            'difficulty': 'intermediate',
            'time_complexity': 'O(n log n)',
            'space_complexity': 'O(log n)',
            'pseudocode': '''procedure quickSort(A, low, high)
    if low < high then
        pivot := partition(A, low, high)
        quickSort(A, low, pivot - 1)
        quickSort(A, pivot + 1, high)
    end if
end procedure

procedure partition(A, low, high)
    pivot := A[high]
    i := low - 1
    
    for j := low to high - 1 do
        if A[j] <= pivot then
            i := i + 1
            swap(A[i], A[j])
        end if
    end for
    
    swap(A[i + 1], A[high])
    return i + 1
end procedure''',
            'implementation': '''def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    
    return quick_sort(left) + middle + quick_sort(right)'''
        },
        {
            'name': 'Binary Search',
            'description': 'An efficient search algorithm that finds the position of a target value within a sorted array by repeatedly dividing the search interval in half.',
            'algorithm_type': 'searching',
            'difficulty': 'beginner',
            'time_complexity': 'O(log n)',
            'space_complexity': 'O(1)',
            'pseudocode': '''procedure binarySearch(A, target)
    left := 0
    right := length(A) - 1
    
    while left <= right do
        mid := (left + right) / 2
        
        if A[mid] = target then
            return mid
        else if A[mid] < target then
            left := mid + 1
        else
            right := mid - 1
        end if
    end while
    
    return -1
end procedure''',
            'implementation': '''def binary_search(arr, target):
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
        },
        {
            'name': 'Depth-First Search (DFS)',
            'description': 'A graph traversal algorithm that explores as far as possible along each branch before backtracking.',
            'algorithm_type': 'graph',
            'difficulty': 'intermediate',
            'time_complexity': 'O(V + E)',
            'space_complexity': 'O(V)',
            'pseudocode': '''procedure DFS(graph, start, visited)
    visited[start] := true
    print(start)
    
    for each neighbor in graph[start] do
        if not visited[neighbor] then
            DFS(graph, neighbor, visited)
        end if
    end for
end procedure''',
            'implementation': '''def dfs(graph, start, visited=None):
    if visited is None:
        visited = set()
    
    visited.add(start)
    print(start)
    
    for neighbor in graph[start]:
        if neighbor not in visited:
            dfs(graph, neighbor, visited)
    
    return visited'''
        }
    ]
    
    # Create algorithms
    for data in algorithms_data:
        Algorithm.objects.create(**data)
        print(f"Created: {data['name']}")
    
    print(f"\n✅ Successfully created {len(algorithms_data)} sample algorithms!")

if __name__ == '__main__':
    create_sample_algorithms() 