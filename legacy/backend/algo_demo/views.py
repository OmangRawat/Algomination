from django.shortcuts import render
from django.http import JsonResponse
from .models import Algorithm

def home(request):
    algorithms = Algorithm.objects.all()
    return render(request, 'home_working.html', {'algorithms': algorithms})

def algorithm_detail(request, algorithm_id):
    try:
        algorithm = Algorithm.objects.get(id=algorithm_id)
        return render(request, 'algorithm_detail.html', {'algorithm': algorithm})
    except Algorithm.DoesNotExist:
        return JsonResponse({'error': 'Algorithm not found'}, status=404)
