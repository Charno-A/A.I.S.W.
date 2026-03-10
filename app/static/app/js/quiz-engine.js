const QuizEngine = {

    questions: [],
    currentIndex: 0,
    score: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    streak: 0,
    difficulty: "medium",
    sessionStartTime: null,
    questionStartTime: null,
    results: [],

    init(questions) {

        this.questions = questions;
        this.currentIndex = 0;
        this.score = 0;
        this.correctAnswers = 0;
        this.incorrectAnswers = 0;
        this.streak = 0;
        this.results = [];
        this.sessionStartTime = Date.now();

        console.log("Quiz initialized with", questions.length, "questions");

        this.startQuestion();
    },

    startQuestion() {

        if (this.currentIndex >= this.questions.length) {
            this.finishQuiz();
            return;
        }

        this.questionStartTime = Date.now();

        const question = this.questions[this.currentIndex];

        console.log("Current Question:", question);

        document.dispatchEvent(new CustomEvent("quiz:questionLoaded", {
            detail: question
        }));
    },

    submitAnswer(answer) {

        const question = this.questions[this.currentIndex];

        const correct = answer === question.correct_answer;

        const timeTaken = Date.now() - this.questionStartTime;

        if (correct) {
            this.correctAnswers++;
            this.streak++;
            this.score += this.calculateScore(timeTaken);
        } else {
            this.incorrectAnswers++;
            this.streak = 0;
        }

        this.adjustDifficulty(correct);

        this.results.push({
            question_id: question.id,
            selected: answer,
            correct: question.correct_answer,
            is_correct: correct,
            time: timeTaken,
            difficulty: this.difficulty
        });

        document.dispatchEvent(new CustomEvent("quiz:answerSubmitted", {
            detail: {
                correct: correct,
                score: this.score
            }
        }));

        this.currentIndex++;

        setTimeout(() => {
            this.startQuestion();
        }, 600);
    },

    calculateScore(timeTaken) {

        let baseScore = 10;

        if (timeTaken < 5000) {
            baseScore += 5;
        }

        if (this.streak >= 3) {
            baseScore += 5;
        }

        return baseScore;
    },

    adjustDifficulty(correct) {

        if (correct && this.streak >= 3) {
            if (this.difficulty === "easy") this.difficulty = "medium";
            else if (this.difficulty === "medium") this.difficulty = "hard";
        }

        if (!correct && this.streak === 0) {
            if (this.difficulty === "hard") this.difficulty = "medium";
            else if (this.difficulty === "medium") this.difficulty = "easy";
        }

        console.log("Difficulty:", this.difficulty);
    },

    getCurrentQuestion() {
        return this.questions[this.currentIndex];
    },

    getProgress() {

        return {
            current: this.currentIndex + 1,
            total: this.questions.length,
            percentage: Math.floor(
                ((this.currentIndex + 1) / this.questions.length) * 100
            )
        };
    },

    finishQuiz() {

        const totalTime = Date.now() - this.sessionStartTime;

        const accuracy = this.correctAnswers / this.questions.length;

        const summary = {
            score: this.score,
            correct: this.correctAnswers,
            incorrect: this.incorrectAnswers,
            accuracy: accuracy,
            total_time: totalTime,
            results: this.results
        };

        console.log("Quiz finished:", summary);

        document.dispatchEvent(new CustomEvent("quiz:finished", {
            detail: summary
        }));
    },

    reset() {

        this.questions = [];
        this.currentIndex = 0;
        this.score = 0;
        this.correctAnswers = 0;
        this.incorrectAnswers = 0;
        this.streak = 0;
        this.results = [];

        console.log("Quiz reset");
    }

};