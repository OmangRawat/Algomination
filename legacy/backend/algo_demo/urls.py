from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('algorithm/<int:algorithm_id>/', views.algorithm_detail, name='algorithm_detail'),
] 