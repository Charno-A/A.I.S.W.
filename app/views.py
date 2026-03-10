from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse, HttpResponseBadRequest
from django.shortcuts import redirect, render
from django.views.decorators.http import require_GET, require_POST
from django.db.models import Avg
import json

from .forms import LoginForm
from .models import Question, StudentProfile, QuizSession, Attempt
from app.services import AnalyticsEngine


def _get_student_profile(user):
    profile, _ = StudentProfile.objects.get_or_create(user=user)
    return profile


def home(request):
    return render(request, "app/home.html")


def login_view(request):
    if request.user.is_authenticated:
        return redirect("app:dashboard")

    if request.method == "POST":
        form = LoginForm(request.POST)

        if form.is_valid():
            username = form.cleaned_data["username"]
            password = form.cleaned_data["password"]

            user = authenticate(request, username=username, password=password)

            if user is not None:
                login(request, user)
                _get_student_profile(user)
                return redirect("app:dashboard")

            form.add_error(None, "Invalid username or password.")
    else:
        form = LoginForm()

    return render(request, "app/login.html", {"form": form})


@login_required
def logout_view(request):
    logout(request)
    return redirect("app:home")


@login_required
def dashboard(request):
    profile = _get_student_profile(request.user)

    sessions = (
        QuizSession.objects.filter(student=profile)
        .order_by("-started_at")[:10]
    )

    context = {
        "profile": profile,
        "sessions": sessions,
    }

    return render(request, "app/dashboard.html", context)


@login_required
def practice(request):
    return render(request, "app/practice.html")


@login_required
def results(request):
    return render(request, "app/results.html")


@login_required
@require_GET
def api_questions(request):
    topic = request.GET.get("topic")

    qs = Question.objects.all()

    if topic:
        qs = qs.filter(topic=topic)

    questions = [
        {
            "id": q.id,
            "question": q.question_text,
            "options": [
                q.option_a,
                q.option_b,
                q.option_c,
                q.option_d,
            ],
            "correct_answer": q.correct_answer,
            "difficulty": q.difficulty,
            "topic": q.topic,
        }
        for q in qs
    ]

    return JsonResponse(questions, safe=False)


@login_required
@require_POST
def api_submit_quiz(request):
    try:
        payload = json.loads(request.body.decode("utf-8"))
    except json.JSONDecodeError:
        return HttpResponseBadRequest("Invalid JSON payload.")

    answers = payload.get("answers") or []

    profile = _get_student_profile(request.user)

    session = QuizSession.objects.create(
        student=profile,
        total_questions=len(answers),
        score=0,
    )

    correct_count = 0

    for item in answers:
        question_id = item.get("question_id")
        selected = item.get("selected")
        is_correct = bool(item.get("is_correct"))

        if not question_id:
            continue

        try:
            question = Question.objects.get(id=question_id)
        except Question.DoesNotExist:
            continue

        Attempt.objects.create(
            quiz_session=session,
            question=question,
            selected_answer=str(selected)[:1] if selected else "",
            is_correct=is_correct,
        )

        if is_correct:
            correct_count += 1

    score = correct_count * 10

    session.score = score
    session.save()

    profile.questions_answered += len(answers)
    profile.correct_answers += correct_count
    profile.points += score
    profile.save()

    accuracy = profile.accuracy()

    return JsonResponse(
        {
            "score": score,
            "total_questions": len(answers),
            "accuracy": accuracy,
        }
    )


@login_required
@require_GET
def api_dashboard_stats(request):
    profile = _get_student_profile(request.user)

    sessions = QuizSession.objects.filter(student=profile)

    total_sessions = sessions.count()
    total_questions = sum(s.total_questions for s in sessions)
    average_score = sessions.aggregate(avg=Avg("score"))["avg"] or 0

    analytics = AnalyticsEngine()
    accuracy = analytics.calculate_accuracy(profile)

    return JsonResponse(
        {
            "total_sessions": total_sessions,
            "average_score": round(average_score, 2),
            "accuracy": accuracy,
            "total_questions": total_questions,
        }
    )


@login_required
@require_GET
def api_predict_score(request):
    profile = _get_student_profile(request.user)

    predicted_score = int(round(profile.accuracy()))

    return JsonResponse({"predicted_score": predicted_score})


@login_required
@require_GET
def api_recommendations(request):
    profile = _get_student_profile(request.user)
    accuracy = profile.accuracy()

    recommendations = []

    if accuracy < 60:
        recommendations.append(
            {
                "topic": "Foundations",
                "message": "Focus on easier questions to build confidence.",
            }
        )
    elif accuracy < 80:
        recommendations.append(
            {
                "topic": "Mixed Practice",
                "message": "Mix easy and medium questions to strengthen weak areas.",
            }
        )
    else:
        recommendations.append(
            {
                "topic": "Challenging Sets",
                "message": "Try more hard questions to push your limits.",
            }
        )

    return JsonResponse(recommendations, safe=False)

