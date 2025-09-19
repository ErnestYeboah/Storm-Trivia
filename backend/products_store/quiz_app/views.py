from .models import Quiz
from rest_framework.viewsets import ModelViewSet
from .serializers import QuizSerializer
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
# Create your views here.

class QuizModelViewset(ModelViewSet):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['difficulty']
    # authentication_classes = [TokenAuthentication , ]
    