from django.urls import path
from . import views

app_name = "app"

urlpatterns = [
    path("", views.home, name="home"),
    path("login/", views.login_view, name="login"),
    path("logout/", views.logout_view, name="logout"),
    path("dashboard/", views.dashboard, name="dashboard"),
    path("practice/", views.practice, name="practice"),
    path("results/", views.results, name="results"),
    # API endpoints used by frontend JavaScript
    path("api/questions/", views.api_questions, name="api_questions"),
    path("api/submit-quiz/", views.api_submit_quiz, name="api_submit_quiz"),
    path(
        "api/dashboard-stats/",
        views.api_dashboard_stats,
        name="api_dashboard_stats",
    ),
    path(
        "api/predict-score/",
        views.api_predict_score,
        name="api_predict_score",
    ),
    path(
        "api/recommendations/",
        views.api_recommendations,
        name="api_recommendations",
    ),
]