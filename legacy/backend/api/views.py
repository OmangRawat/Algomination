from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from algorithms.models import Algorithm, Project, Contact, Feedback


class AlgorithmViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Algorithm.objects.filter(is_active=True)
    lookup_field = 'slug'


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()


class UserSubmissionViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()


class ContactViewSet(viewsets.ModelViewSet):
    queryset = Contact.objects.all()


class FeedbackViewSet(viewsets.ModelViewSet):
    queryset = Feedback.objects.all()


@api_view(['GET'])
def statistics(request):
    """Get platform statistics."""
    return Response({
        'total_algorithms': Algorithm.objects.filter(is_active=True).count(),
        'total_projects': Project.objects.filter(status='approved').count(),
        'total_contacts': Contact.objects.count(),
        'total_feedback': Feedback.objects.count(),
    }) 