from .models import Quiz
from rest_framework.viewsets import ModelViewSet
from .serializers import QuizSerializer
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
import random
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
# Create your views here.

# class QuizModelViewset(ModelViewSet):
#     queryset = Quiz.objects.all()
#     serializer_class = QuizSerializer
#     filter_backends = [DjangoFilterBackend]
#     filterset_fields = ['difficulty']
#     # authentication_classes = [TokenAuthentication , ]
    

class QuizModelViewset(ModelViewSet):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['difficulty']



    @action(detail=False, methods=["get"])
    def quiz(self, request):
        questions = list(self.get_queryset())
        random.shuffle(questions)

        questions = questions[:30]

        serializer = self.get_serializer(questions, many=True)
        return Response(serializer.data)