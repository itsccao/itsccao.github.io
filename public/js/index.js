const noEffectOnSmallScreen = window.matchMedia("(max-width: 50rem)");
const cardMotionAllowed = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");

let initialized = false;
const cardResets = new Map();

function resetCard(card, animate = true) {
    clearTimeout(cardResets.get(card));
    if (!animate) card.style.transition = "none";
    // Remove the 3D transform entirely so the image is repainted at the current zoom.
    card.style.transform = "";
    cardResets.set(card, setTimeout(() => {
        card.style.transition = "";
        cardResets.delete(card);
    }, animate ? 500 : 0));
}

function initCardImageEffect() {
    if (initialized) return;
    initialized = true;

    document.querySelectorAll(".index-card").forEach((card) => {
        const wrapper = card.closest(".index-avatar-wrapper");
        card.addEventListener("pointermove", (event) => {
            if (noEffectOnSmallScreen.matches || !cardMotionAllowed.matches) return;
            clearTimeout(cardResets.get(card));
            // Measure the stationary wrapper, avoiding feedback from the tilted card.
            const rect = wrapper.getBoundingClientRect();
            const x = Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1));
            const y = Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1));
            card.style.transform = `perspective(900px) rotateX(${-y * 10}deg) rotateY(${x * 10}deg) scale(1.1)`;
        });
        card.addEventListener("pointerleave", () => resetCard(card));
        card.addEventListener("pointercancel", () => resetCard(card, false));
    });
}

function handleScreenChange() {
    document.querySelectorAll(".index-card").forEach((card) => resetCard(card, false));
    initCardImageEffect();
}

cardMotionAllowed.addEventListener("change", handleScreenChange);
window.addEventListener("blur", handleScreenChange);
window.addEventListener("resize", handleScreenChange);

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