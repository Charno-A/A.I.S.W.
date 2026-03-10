from app.models import Attempt


class AnalyticsEngine:

    def calculate_accuracy(self, student):
        attempts = Attempt.objects.filter(quiz_session__student=student)

        total = attempts.count()
        correct = attempts.filter(is_correct=True).count()

        if total == 0:
            return 0

        return round((correct / total) * 100, 2)

    def get_student_summary(self, student):
        accuracy = self.calculate_accuracy(student)

        return {
            "accuracy": accuracy,
        }