const noEffectOnSmallScreen = window.matchMedia("(max-width: 50rem)");

let initialized = false;

function initCardImageEffect() {
    if (initialized) return;
    initialized = true;

    const cards = document.querySelectorAll(".index-card");

    cards.forEach((card) => {
        let transitionTimeout;

        card.addEventListener("mouseenter", function () {
            if (noEffectOnSmallScreen.matches) return;

            clearTimeout(transitionTimeout);
            card.style.transition = "transform 0.15s ease-out";

            transitionTimeout = setTimeout(() => {
                card.style.transition = "none";
            }, 150);
        });

        card.addEventListener("mousemove", function (e) {
            if (noEffectOnSmallScreen.matches) return;

            const rect = card.getBoundingClientRect();

            const x = e.offsetX;
            const y = e.offsetY;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -12;
            const rotateY = ((x - centerX) / centerX) * 12;

            card.style.setProperty("--glow-x", `${x}px`);
            card.style.setProperty("--glow-y", `${y}px`);
            card.classList.add("glow");

            card.style.transform =
                `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.25)`;
        });

        card.addEventListener("mouseleave", function () {
            clearTimeout(transitionTimeout);

            card.classList.remove("glow");
            card.style.transition = "transform 0.5s ease-out";
            card.style.transform =
                "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
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

document.addEventListener("DOMContentLoaded", () => {
    handleScreenChange();
});

noEffectOnSmallScreen.addEventListener("change", handleScreenChange);