from .adaptive_engine import AdaptiveEngine
from app.models import Attempt, QuizSession


class QuizManager:

    def __init__(self, student):
        self.student = student
        self.engine = AdaptiveEngine()
        self.session = QuizSession.objects.create(student=student)

    def start_quiz(self):
        return self.engine.get_next_question(current_score=0)

    def submit_answer(self, question, selected_answer, current_score):
        is_correct = question.correct_answer == selected_answer

        new_score = self.engine.update_score(current_score, is_correct)

        Attempt.objects.create(
            quiz_session=self.session,
            question=question,
            selected_answer=selected_answer,
            is_correct=is_correct,
        )

        self.session.total_questions += 1
        if is_correct:
            self.session.score += 10
        self.session.save()

        next_question = self.engine.get_next_question(new_score)

        return {
            "is_correct": is_correct,
            "new_score": new_score,
            "next_question": next_question,
        }