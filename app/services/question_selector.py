import random
from app.models import Question


class QuestionSelector:

    def select_by_difficulty(self, difficulty):
        questions = Question.objects.filter(difficulty=difficulty)

        if questions.exists():
            return random.choice(list(questions))

        return None