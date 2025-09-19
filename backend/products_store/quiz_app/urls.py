from django.urls import path, include
from rest_framework import routers
from .views import QuizModelViewset


router = routers.DefaultRouter()

router.register("quiz", QuizModelViewset , basename="quiz" )
urlpatterns = [
    path('api/', include(router.urls) )
]
