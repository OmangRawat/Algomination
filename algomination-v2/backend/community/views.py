from rest_framework import generics, permissions

from .models import ContactMessage, Opinion, Project
from .serializers import (
    ContactMessageSerializer,
    OpinionSerializer,
    ProjectSerializer,
)


class OpinionCreateView(generics.CreateAPIView):
    queryset = Opinion.objects.all()
    serializer_class = OpinionSerializer
    permission_classes = [permissions.AllowAny]


class ProjectCreateView(generics.CreateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [permissions.AllowAny]


class ContactMessageCreateView(generics.CreateAPIView):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [permissions.AllowAny]
