from django.db import models
from django.contrib.auth.models import User


class Question(models.Model):
    DIFFICULTY_LEVELS = [
        ("easy", "Easy"),
        ("medium", "Medium"),
        ("hard", "Hard"),
    ]

    topic = models.CharField(max_length=100)
    difficulty = models.CharField(max_length=10, choices=DIFFICULTY_LEVELS)

    question_text = models.TextField()

    option_a = models.CharField(max_length=255)
    option_b = models.CharField(max_length=255)
    option_c = models.CharField(max_length=255)
    option_d = models.CharField(max_length=255)

    correct_answer = models.CharField(max_length=1)

    explanation = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.topic} ({self.difficulty})"


class StudentProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    level = models.IntegerField(default=1)
    points = models.IntegerField(default=0)

    questions_answered = models.IntegerField(default=0)
    correct_answers = models.IntegerField(default=0)

    def accuracy(self):
        if self.questions_answered == 0:
            return 0
        return round((self.correct_answers / self.questions_answered) * 100, 2)

    def __str__(self):
        return self.user.username


class QuizSession(models.Model):
    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE)

    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    total_questions = models.IntegerField(default=0)
    score = models.IntegerField(default=0)

    def __str__(self):
        return f"Session {self.id} - {self.student.user.username}"


class Attempt(models.Model):
    quiz_session = models.ForeignKey(
        QuizSession,
        on_delete=models.CASCADE,
        related_name="attempts"
    )

    question = models.ForeignKey(Question, on_delete=models.CASCADE)

    selected_answer = models.CharField(max_length=1)
    is_correct = models.BooleanField()

    answered_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Attempt {self.id} - Q{self.question.id}"