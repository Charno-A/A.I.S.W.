from .question_selector import QuestionSelector
from .score_predictor import ScorePredictor


class AdaptiveEngine:

    def __init__(self):
        self.selector = QuestionSelector()
        self.predictor = ScorePredictor()

    def get_next_question(self, current_score):
        difficulty = self.predictor.predict_difficulty(current_score)
        return self.selector.select_by_difficulty(difficulty)

    def update_score(self, current_score, is_correct):
        if is_correct:
            return current_score + 10
        return max(0, current_score - 5)