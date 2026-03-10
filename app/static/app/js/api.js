const API = {

    baseURL: "/api",

    getCSRFToken() {

        const cookieValue = document.cookie
            .split("; ")
            .find(row => row.startsWith("csrftoken="));

        return cookieValue ? cookieValue.split("=")[1] : null;
    },

    async request(endpoint, method = "GET", data = null) {

        const options = {
            method: method,
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": this.getCSRFToken()
            }
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        try {

            const response = await fetch(`${this.baseURL}${endpoint}`, options);

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            return await response.json();

        } catch (error) {

            console.error("API Request Failed:", error);

            if (typeof showError === "function") {
                showError("Server connection failed.");
            }

            throw error;
        }
    },

    async fetchQuestions(topic = null) {

        let endpoint = "/questions/";

        if (topic) {
            endpoint += `?topic=${topic}`;
        }

        return await this.request(endpoint, "GET");
    },

    async submitQuiz(results) {

        return await this.request("/submit-quiz/", "POST", {
            answers: results
        });

    },

    async getDashboardStats() {

        return await this.request("/dashboard-stats/", "GET");

    },

    async getPerformanceHistory() {

        return await this.request("/performance-history/", "GET");

    },

    async getPrediction() {

        return await this.request("/predict-score/", "GET");

    },

    async getRecommendations() {

        return await this.request("/recommendations/", "GET");

    },

    async startPracticeSession() {

        return await this.request("/practice/start/", "POST");

    },

    async submitAnswer(questionId, answer) {

        return await this.request("/practice/answer/", "POST", {
            question_id: questionId,
            answer: answer
        });

    },

    async endPracticeSession(sessionId) {

        return await this.request("/practice/end/", "POST", {
            session_id: sessionId
        });

    }

};