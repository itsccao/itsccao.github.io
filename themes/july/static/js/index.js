const noEffectOnSmallScreen = window.matchMedia("(max-width: 50rem)");

let initialized = false;

function initCardImageEffect() {
    if (initialized) return;
    initialized = true;

    const cards = document.querySelectorAll(".index-card");

    cards.forEach((card) => {
        let transitionTimeout;
        let leaveTimeout;

        card.addEventListener("mouseenter", function () {
            if (noEffectOnSmallScreen.matches) return;

            clearTimeout(transitionTimeout);
            clearTimeout(leaveTimeout);

            transitionTimeout = setTimeout(() => {
                card.style.transition = "width 0.5s cubic-bezier(0.16, 1, 0.3, 1), height 0.5s cubic-bezier(0.16, 1, 0.3, 1), border-radius 0.45s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.45s ease, border-color 0.35s ease";
            }, 200);
        });

        card.addEventListener("mousemove", function (e) {
            if (noEffectOnSmallScreen.matches) return;

            const rect = card.getBoundingClientRect();

            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.setProperty("--glow-x", `${x}px`);
            card.style.setProperty("--glow-y", `${y}px`);
            card.classList.add("glow");

            card.style.transform =
                `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
        });

        card.addEventListener("mouseleave", function () {
            clearTimeout(transitionTimeout);
            clearTimeout(leaveTimeout);

            card.classList.remove("glow");
            card.style.transition = "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), width 0.5s cubic-bezier(0.16, 1, 0.3, 1), height 0.5s cubic-bezier(0.16, 1, 0.3, 1), border-radius 0.45s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.45s ease, border-color 0.35s ease";
            card.style.transform =
                "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";

            leaveTimeout = setTimeout(() => {
                card.style.transition = "";
                card.style.transform = "";
            }, 500);
        });
    });
}

function handleScreenChange() {
    const cards = document.querySelectorAll(".index-card");

    if (noEffectOnSmallScreen.matches) {
        cards.forEach((card) => {
            card.classList.remove("glow");
            card.style.transition = "";
            card.style.transform = "";
        });
        return;
    }

    initCardImageEffect();
}

function initSlideNavScrollSpy() {
    const slides = document.querySelectorAll(".index-slide");
    const dots = document.querySelectorAll(".index-slide-nav-dot");
    if (!slides.length || !dots.length) return;

    function updateActiveDot(activeId) {
        dots.forEach((dot) => {
            const href = dot.getAttribute("href");
            if (href === `#${activeId}`) {
                dot.classList.add("active");
            } else {
                dot.classList.remove("active");
            }
        });
    }

    const observerOptions = {
        root: null,
        rootMargin: "-30% 0px -30% 0px",
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                updateActiveDot(entry.target.id);
            }
        });
    }, observerOptions);

    slides.forEach((slide) => observer.observe(slide));

    const initialId = window.location.hash ? window.location.hash.slice(1) : "intro";
    updateActiveDot(initialId);
}

document.addEventListener("DOMContentLoaded", () => {
    handleScreenChange();
    initSlideNavScrollSpy();
});

window.addEventListener("pageshow", () => {
    handleScreenChange();
    initSlideNavScrollSpy();
});

noEffectOnSmallScreen.addEventListener("change", handleScreenChange);