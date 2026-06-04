from django.urls import path

from .views import (
    ContactMessageCreateView,
    OpinionCreateView,
    ProjectCreateView,
)

urlpatterns = [
    path("feedback/", OpinionCreateView.as_view(), name="feedback"),
    path("projects/", ProjectCreateView.as_view(), name="projects"),
    path("contact/", ContactMessageCreateView.as_view(), name="contact"),
]
