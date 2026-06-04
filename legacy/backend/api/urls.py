from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'algorithms', views.AlgorithmViewSet)
router.register(r'projects', views.ProjectViewSet)
router.register(r'submissions', views.UserSubmissionViewSet)
router.register(r'contact', views.ContactViewSet, basename='contact')
router.register(r'feedback', views.FeedbackViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('algorithms/<slug:slug>/execute/', views.execute_algorithm, name='execute_algorithm'),
    path('algorithms/<slug:slug>/visualize/', views.visualize_algorithm, name='visualize_algorithm'),
    path('statistics/', views.statistics, name='statistics'),
] 