from django.db import models

# Create your models here.

DIFFICULTY_CHOICE = [
    ('native', 'native'),
    ('student', 'student'),
    ('wise', 'wise'),
]


class Quiz(models.Model):
    hint_image = models.ImageField(blank=True , default="default.png", )
    question = models.CharField(max_length=255)
    option1 = models.CharField(max_length=100)
    option2 = models.CharField(max_length=100)
    option3 = models.CharField(max_length=100)
    option4 = models.CharField(max_length=100)
    user_choice = models.CharField(max_length=100 , default="not started")
    difficulty = models.CharField(max_length=10, choices=DIFFICULTY_CHOICE, default='student')
    correct_answer = models.CharField(max_length=100)
    stage_status = models.CharField(max_length=100, default='not started')

    def __str__(self):
        return self.question

    