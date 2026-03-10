document.addEventListener("DOMContentLoaded", () => {
    Practice.init();
});

const Practice = {

    questionContainer: null,
    answersContainer: null,
    progressBar: null,
    scoreDisplay: null,
    startButton: null,

    init() {

        this.questionContainer = document.querySelector("#questionText");
        this.answersContainer = document.querySelector("#answersContainer");
        this.progressBar = document.querySelector("#progressBar");
        this.scoreDisplay = document.querySelector("#scoreDisplay");
        this.startButton = document.querySelector("#startPractice");

        this.bindEvents();

        console.log("Practice page initialized");
    },

    bindEvents() {

        if (this.startButton) {
            this.startButton.addEventListener("click", () => {
                this.startPractice();
            });
        }

        document.addEventListener("quiz:questionLoaded", (e) => {
            this.renderQuestion(e.detail);
        });

        document.addEventListener("quiz:answerSubmitted", (e) => {
            this.updateScore(e.detail.score);
        });

        document.addEventListener("quiz:finished", (e) => {
            this.showResults(e.detail);
        });
    },

    async startPractice() {

        try {

            UI.showLoadingScreen();

            const questions = await API.fetchQuestions();

            UI.hideLoadingScreen();

            if (!questions || questions.length === 0) {

                showWarning("No practice questions available.");

                return;
            }

            QuizEngine.init(questions);

        } catch (error) {

            console.error(error);

            showError("Failed to start practice session.");

        }
    },

    renderQuestion(question) {

        if (!this.questionContainer || !this.answersContainer) return;

        this.questionContainer.innerText = question.question;

        this.answersContainer.innerHTML = "";

        question.options.forEach(option => {

            const button = document.createElement("button");

            button.className = "answer-option";
            button.innerText = option;

            button.addEventListener("click", () => {
                this.submitAnswer(option, button);
            });

            this.answersContainer.appendChild(button);

        });

        this.updateProgress();

    },

    submitAnswer(answer, button) {

        const buttons = document.querySelectorAll(".answer-option");

        buttons.forEach(btn => btn.disabled = true);

        button.classList.add("selected");

        QuizEngine.submitAnswer(answer);
    },

    updateScore(score) {

        if (!this.scoreDisplay) return;

        this.scoreDisplay.innerText = score;

    },

    updateProgress() {

        const progress = QuizEngine.getProgress();

        if (!this.progressBar) return;

        this.progressBar.style.width = progress.percentage + "%";

    },

    async showResults(summary) {

        try {

            UI.showLoadingScreen();

            await API.submitQuiz(summary.results);

            UI.hideLoadingScreen();

        } catch (error) {

            console.error("Failed to submit quiz results");

        }

        const resultsHTML = `
            <div class="quiz-results">
                <h2>Practice Complete</h2>
                <p>Score: ${summary.score}</p>
                <p>Correct: ${summary.correct}</p>
                <p>Incorrect: ${summary.incorrect}</p>
                <p>Accuracy: ${(summary.accuracy * 100).toFixed(1)}%</p>
            </div>
        `;

        this.questionContainer.innerHTML = resultsHTML;

        this.answersContainer.innerHTML = "";

        showSuccess("Practice session completed!");

    }

};