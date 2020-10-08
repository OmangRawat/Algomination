
from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="Algomination"),
    path("search/", views.search, name="search"),
]