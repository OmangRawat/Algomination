
from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="Algomination"),
    path("search/", views.search, name="search"),
    path("BubbleSort/", views.BubbleSort, name="BubbleSort"),
    path("SelectionSort/", views.SelectionSort, name="SelectionSort"),
    path("InsertionSort/", views.InsertionSort, name="InsertionSort"),
    path("Stack/", views.Stack, name="Stack")
]