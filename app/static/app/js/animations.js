document.addEventListener("DOMContentLoaded", () => {
    Animations.init();
});

const Animations = {

    observer: null,

    init() {

        console.log("Animations initialized");

        this.pageReveal();
        this.initScrollAnimations();
        this.initFloatingElements();
        this.initButtonEffects();
        this.initProgressAnimations();

    },

    pageReveal() {

        const elements = document.querySelectorAll(".reveal-on-load");

        elements.forEach((el, index) => {

            el.style.opacity = 0;
            el.style.transform = "translateY(20px)";

            setTimeout(() => {

                el.style.transition = "all 0.6s ease";
                el.style.opacity = 1;
                el.style.transform = "translateY(0)";

            }, 120 * index);

        });

    },

    initScrollAnimations() {

        const elements = document.querySelectorAll(".animate-on-scroll");

        if (elements.length === 0) return;

        this.observer = new IntersectionObserver(entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("animated");

                    this.observer.unobserve(entry.target);

                }

            });

        }, {
            threshold: 0.2
        });

        elements.forEach(el => {

            el.style.opacity = 0;
            el.style.transform = "translateY(30px)";

            this.observer.observe(el);

        });

    },

    initFloatingElements() {

        const elements = document.querySelectorAll(".floating");

        elements.forEach(el => {

            let direction = 1;

            setInterval(() => {

                const current = el.style.transform || "translateY(0px)";
                const match = current.match(/-?\d+/);

                let value = match ? parseInt(match[0]) : 0;

                value += direction;

                if (value > 10 || value < -10) {
                    direction *= -1;
                }

                el.style.transform = `translateY(${value}px)`;

            }, 80);

        });

    },

    initButtonEffects() {

        const buttons = document.querySelectorAll("button");

        buttons.forEach(btn => {

            btn.addEventListener("mouseenter", () => {

                btn.style.transition = "transform 0.15s ease";
                btn.style.transform = "scale(1.05)";

            });

            btn.addEventListener("mouseleave", () => {

                btn.style.transform = "scale(1)";

            });

            btn.addEventListener("mousedown", () => {

                btn.style.transform = "scale(0.97)";

            });

            btn.addEventListener("mouseup", () => {

                btn.style.transform = "scale(1.05)";

            });

        });

    },

    initProgressAnimations() {

        const bars = document.querySelectorAll(".animated-progress");

        bars.forEach(bar => {

            const target = bar.dataset.progress;

            if (!target) return;

            let width = 0;

            const interval = setInterval(() => {

                width++;

                bar.style.width = width + "%";

                if (width >= target) {
                    clearInterval(interval);
                }

            }, 10);

        });

    },

    countUp(element, target, duration = 800) {

        let start = 0;
        const increment = target / (duration / 16);

        function update() {

            start += increment;

            if (start >= target) {

                element.innerText = target;

            } else {

                element.innerText = Math.floor(start);

                requestAnimationFrame(update);

            }

        }

        update();

    },

    revealChart(canvas) {

        if (!canvas) return;

        canvas.style.opacity = 0;
        canvas.style.transform = "scale(0.9)";

        setTimeout(() => {

            canvas.style.transition = "all 0.6s ease";
            canvas.style.opacity = 1;
            canvas.style.transform = "scale(1)";

        }, 200);

    }

};