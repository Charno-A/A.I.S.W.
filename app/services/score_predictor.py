class ScorePredictor:

    def predict_difficulty(self, current_score):
        """
        Determines next difficulty level
        based on student score.
        """

        if current_score >= 80:
            return "hard"
        elif current_score >= 50:
            return "medium"
        return "easy"

    def predict_final_performance(self, accuracy):
        """
        Predicts final grade category.
        """

        if accuracy >= 85:
            return "A"
        elif accuracy >= 70:
            return "B"
        elif accuracy >= 60:
            return "C"
        return "At Risk"