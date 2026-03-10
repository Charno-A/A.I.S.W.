document.addEventListener("DOMContentLoaded", () => {
    Charts.init();
});

const Charts = {

    scoreChart: null,
    accuracyChart: null,
    topicChart: null,
    predictionChart: null,

    async init() {

        console.log("Charts initialized");

        try {

            const stats = await API.getDashboardStats();
            const history = await API.getPerformanceHistory();
            const prediction = await API.getPrediction();

            this.createScoreChart(history);
            this.createAccuracyChart(stats);
            this.createTopicChart(stats);
            this.createPredictionChart(prediction);

        } catch (error) {

            console.error("Failed to load dashboard charts:", error);

            if (typeof showError === "function") {
                showError("Failed to load analytics.");
            }

        }

    },

    createScoreChart(history) {

        const ctx = document.getElementById("scoreChart");

        if (!ctx) return;

        const labels = history.map(h => h.date);
        const scores = history.map(h => h.score);

        this.scoreChart = new Chart(ctx, {
            type: "line",
            data: {
                labels: labels,
                datasets: [{
                    label: "Score Trend",
                    data: scores,
                    borderWidth: 2,
                    tension: 0.3,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: true
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });

    },

    createAccuracyChart(stats) {

        const ctx = document.getElementById("accuracyChart");

        if (!ctx) return;

        const data = [
            stats.correct_answers,
            stats.incorrect_answers
        ];

        this.accuracyChart = new Chart(ctx, {
            type: "doughnut",
            data: {
                labels: ["Correct", "Incorrect"],
                datasets: [{
                    data: data,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: "bottom"
                    }
                }
            }
        });

    },

    createTopicChart(stats) {

        const ctx = document.getElementById("topicChart");

        if (!ctx || !stats.topic_performance) return;

        const labels = stats.topic_performance.map(t => t.topic);
        const values = stats.topic_performance.map(t => t.score);

        this.topicChart = new Chart(ctx, {
            type: "bar",
            data: {
                labels: labels,
                datasets: [{
                    label: "Topic Mastery",
                    data: values,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });

    },

    createPredictionChart(prediction) {

        const ctx = document.getElementById("predictionChart");

        if (!ctx) return;

        const predictedScore = prediction.predicted_score || 0;
        const confidence = prediction.confidence || 0;

        this.predictionChart = new Chart(ctx, {
            type: "radar",
            data: {
                labels: [
                    "Knowledge",
                    "Speed",
                    "Consistency",
                    "Accuracy",
                    "Confidence"
                ],
                datasets: [{
                    label: "Predicted Performance",
                    data: [
                        predictedScore,
                        confidence,
                        predictedScore * 0.9,
                        predictedScore * 0.95,
                        confidence * 0.8
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });

    },

    updateCharts(newData) {

        if (this.scoreChart) {

            this.scoreChart.data.labels.push(newData.date);
            this.scoreChart.data.datasets[0].data.push(newData.score);
            this.scoreChart.update();

        }

    },

    destroyCharts() {

        if (this.scoreChart) this.scoreChart.destroy();
        if (this.accuracyChart) this.accuracyChart.destroy();
        if (this.topicChart) this.topicChart.destroy();
        if (this.predictionChart) this.predictionChart.destroy();

    }

};