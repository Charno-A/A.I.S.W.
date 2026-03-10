document.addEventListener("DOMContentLoaded", () => {
    Dashboard.init();
});

const Dashboard = {

    predictionElement: null,
    recommendationContainer: null,
    statsContainer: null,

    async init() {

        console.log("Dashboard initialized");

        this.predictionElement = document.querySelector("#predictedScore");
        this.recommendationContainer = document.querySelector("#recommendations");
        this.statsContainer = document.querySelector("#dashboardStats");

        try {

            UI.showLoadingScreen();

            const stats = await API.getDashboardStats();
            const prediction = await API.getPrediction();
            const recommendations = await API.getRecommendations();

            UI.hideLoadingScreen();

            this.renderStats(stats);
            this.renderPrediction(prediction);
            this.renderRecommendations(recommendations);

        } catch (error) {

            console.error("Dashboard failed to load:", error);

            UI.hideLoadingScreen();

            showError("Failed to load dashboard.");

        }

    },

    renderStats(stats) {

        if (!this.statsContainer || !stats) return;

        const html = `
            <div class="stat-card">
                <h3>Total Practice Sessions</h3>
                <p>${stats.total_sessions || 0}</p>
            </div>

            <div class="stat-card">
                <h3>Average Score</h3>
                <p>${stats.average_score || 0}</p>
            </div>

            <div class="stat-card">
                <h3>Accuracy</h3>
                <p>${stats.accuracy || 0}%</p>
            </div>

            <div class="stat-card">
                <h3>Total Questions</h3>
                <p>${stats.total_questions || 0}</p>
            </div>
        `;

        this.statsContainer.innerHTML = html;

    },

    renderPrediction(prediction) {

        if (!this.predictionElement || !prediction) return;

        const score = prediction.predicted_score || 0;

        this.animateScore(score);

    },

    animateScore(targetScore) {

        let current = 0;

        const interval = setInterval(() => {

            current++;

            this.predictionElement.innerText = current;

            if (current >= targetScore) {
                clearInterval(interval);
            }

        }, 20);

    },

    renderRecommendations(recommendations) {

        if (!this.recommendationContainer) return;

        if (!recommendations || recommendations.length === 0) {

            this.recommendationContainer.innerHTML = `
                <div class="empty-state">
                    <img src="/static/app/images/no-results.png" alt="No Recommendations">
                    <p>No recommendations yet. Complete practice sessions to generate insights.</p>
                </div>
            `;

            return;
        }

        const html = recommendations.map(rec => {

            return `
                <div class="recommendation-card">
                    <h4>${rec.topic}</h4>
                    <p>${rec.message}</p>
                </div>
            `;

        }).join("");

        this.recommendationContainer.innerHTML = html;

    },

    async refreshDashboard() {

        try {

            const stats = await API.getDashboardStats();
            const prediction = await API.getPrediction();
            const recommendations = await API.getRecommendations();

            this.renderStats(stats);
            this.renderPrediction(prediction);
            this.renderRecommendations(recommendations);

            showInfo("Dashboard updated");

        } catch (error) {

            console.error("Dashboard refresh failed");

        }

    }

};