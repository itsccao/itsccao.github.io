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

let scrollInitialized = false;

function initScrollButton() {
    if (scrollInitialized) return;
    const scrollBtn = document.querySelector(".index-scroll-btn");
    if (!scrollBtn) return;
    scrollInitialized = true;

    scrollBtn.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector("#intro-after");
        if (target) {
            target.scrollIntoView({ behavior: "smooth" });
        }
    });

    function handleScroll() {
        if (window.scrollY > 60) {
            scrollBtn.classList.add("hidden");
        } else {
            scrollBtn.classList.remove("hidden");
        }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
}

// Clear any stale anchor hash on load to avoid mobile browser auto-jumping
if (window.location.hash) {
    history.replaceState(null, "", window.location.pathname + window.location.search);
}

document.addEventListener("DOMContentLoaded", () => {
    handleScreenChange();
    initScrollButton();
});

window.addEventListener("pageshow", () => {
    handleScreenChange();
    initScrollButton();
});

noEffectOnSmallScreen.addEventListener("change", handleScreenChange);