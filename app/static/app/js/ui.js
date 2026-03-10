document.addEventListener("DOMContentLoaded", () => {
    UI.init();
});

const UI = {

    init() {
        this.setupSidebarToggle();
        this.setupDarkMode();
        this.setupDropdowns();
        this.setupModals();
        this.setupNotifications();
        this.setupLoadingButtons();
        this.setupTooltips();
        console.log("UI Initialized");
    },

    setupSidebarToggle() {
        const toggleBtn = document.querySelector("#sidebarToggle");
        const sidebar = document.querySelector(".sidebar");

        if (!toggleBtn || !sidebar) return;

        toggleBtn.addEventListener("click", () => {
            sidebar.classList.toggle("collapsed");
        });
    },

    setupDarkMode() {
        const toggle = document.querySelector("#darkModeToggle");

        const savedTheme = localStorage.getItem("theme");

        if (savedTheme === "dark") {
            document.body.classList.add("dark");
        }

        if (!toggle) return;

        toggle.addEventListener("click", () => {
            document.body.classList.toggle("dark");

            if (document.body.classList.contains("dark")) {
                localStorage.setItem("theme", "dark");
            } else {
                localStorage.setItem("theme", "light");
            }
        });
    },

    setupDropdowns() {
        const dropdowns = document.querySelectorAll(".dropdown");

        dropdowns.forEach(dropdown => {

            const button = dropdown.querySelector(".dropdown-toggle");
            const menu = dropdown.querySelector(".dropdown-menu");

            if (!button || !menu) return;

            button.addEventListener("click", (e) => {

                e.stopPropagation();

                menu.classList.toggle("show");

                document.querySelectorAll(".dropdown-menu").forEach(other => {
                    if (other !== menu) {
                        other.classList.remove("show");
                    }
                });

            });
        });

        document.addEventListener("click", () => {
            document.querySelectorAll(".dropdown-menu").forEach(menu => {
                menu.classList.remove("show");
            });
        });
    },

    setupModals() {

        const modalTriggers = document.querySelectorAll("[data-modal-target]");
        const modalCloses = document.querySelectorAll("[data-modal-close]");

        modalTriggers.forEach(trigger => {

            trigger.addEventListener("click", () => {

                const modalId = trigger.dataset.modalTarget;
                const modal = document.getElementById(modalId);

                if (modal) {
                    modal.classList.add("open");
                }

            });

        });

        modalCloses.forEach(closeBtn => {

            closeBtn.addEventListener("click", () => {

                const modal = closeBtn.closest(".modal");

                if (modal) {
                    modal.classList.remove("open");
                }

            });

        });

        window.addEventListener("click", (e) => {

            if (e.target.classList.contains("modal")) {
                e.target.classList.remove("open");
            }

        });
    },

    setupNotifications() {

        const container = document.createElement("div");
        container.id = "toast-container";

        document.body.appendChild(container);
    },

    showToast(message, type = "info") {

        const container = document.getElementById("toast-container");

        const toast = document.createElement("div");

        toast.className = `toast toast-${type}`;
        toast.innerText = message;

        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add("visible");
        }, 100);

        setTimeout(() => {

            toast.classList.remove("visible");

            setTimeout(() => {
                toast.remove();
            }, 400);

        }, 4000);

    },

    setupLoadingButtons() {

        const buttons = document.querySelectorAll("[data-loading]");

        buttons.forEach(button => {

            button.addEventListener("click", () => {

                button.classList.add("loading");

                const originalText = button.innerText;

                button.innerText = "Loading...";

                setTimeout(() => {

                    button.classList.remove("loading");
                    button.innerText = originalText;

                }, 2000);

            });

        });

    },

    setupTooltips() {

        const elements = document.querySelectorAll("[data-tooltip]");

        elements.forEach(el => {

            const tooltipText = el.dataset.tooltip;

            const tooltip = document.createElement("span");
            tooltip.className = "tooltip";
            tooltip.innerText = tooltipText;

            el.appendChild(tooltip);

            el.addEventListener("mouseenter", () => {
                tooltip.classList.add("show");
            });

            el.addEventListener("mouseleave", () => {
                tooltip.classList.remove("show");
            });

        });

    },

    showLoadingScreen() {

        let loader = document.getElementById("page-loader");

        if (!loader) {

            loader = document.createElement("div");
            loader.id = "page-loader";

            loader.innerHTML = `
                <div class="spinner"></div>
                <p>Loading...</p>
            `;

            document.body.appendChild(loader);

        }

        loader.classList.add("active");
    },

    hideLoadingScreen() {

        const loader = document.getElementById("page-loader");

        if (loader) {
            loader.classList.remove("active");
        }

    }

};

function showSuccess(message) {
    UI.showToast(message, "success");
}

function showError(message) {
    UI.showToast(message, "error");
}

function showInfo(message) {
    UI.showToast(message, "info");
}

function showWarning(message) {
    UI.showToast(message, "warning");
}