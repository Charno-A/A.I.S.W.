from django.contrib import admin
from .models import Question, StudentProfile, QuizSession, Attempt


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "topic",
        "difficulty",
        "correct_answer",
        "created_at",
    )

    list_filter = (
        "topic",
        "difficulty",
    )

    search_fields = (
        "question_text",
        "topic",
    )

    ordering = ("topic", "difficulty")


@admin.register(StudentProfile)
class StudentProfileAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "level",
        "points",
        "questions_answered",
        "correct_answers",
    )

    search_fields = (
        "user__username",
    )


@admin.register(QuizSession)
class QuizSessionAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "student",
        "score",
        "total_questions",
        "started_at",
        "completed_at",
    )

    list_filter = (
        "started_at",
        "completed_at",
    )

    search_fields = (
        "student__user__username",
    )

    ordering = ("-started_at",)


@admin.register(Attempt)
class AttemptAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "quiz_session",
        "question",
        "selected_answer",
        "is_correct",
        "answered_at",
    )

    list_filter = (
        "is_correct",
    )

    search_fields = (
        "question__topic",
        "quiz_session__student__user__username",
    )

    ordering = ("-answered_at",)