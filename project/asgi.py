from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required

from .forms import LoginForm
from .models import StudentProfile, QuizSession


def home(request):
    return render(request, "app/home.html")


def login_view(request):
    form = LoginForm(request.POST or None)

    if request.method == "POST" and form.is_valid():
        username = form.cleaned_data["username"]
        password = form.cleaned_data["password"]

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            return redirect("app:dashboard")

        form.add_error(None, "Invalid username or password")

    return render(request, "app/login.html", {"form": form})


def logout_view(request):
    logout(request)
    return redirect("app:home")


@login_required
def dashboard(request):
    profile = StudentProfile.objects.get(user=request.user)

    sessions = QuizSession.objects.filter(student=profile).order_by("-started_at")[:10]

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
