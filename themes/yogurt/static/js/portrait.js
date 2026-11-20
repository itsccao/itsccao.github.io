const wrapper = document.querySelector(".home-portrait-wrapper");
const portrait = wrapper.querySelector(".home-portrait");
const motion = matchMedia("(min-width: 50rem) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
const maxTilt = 15;

function resetPortrait() {
    portrait.style.transform = "";
}

wrapper.addEventListener("pointermove", (event) => {
    if (!motion.matches || event.pointerType === "touch") return;

    const bounds = wrapper.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom) {
        resetPortrait();
        return;
    }

    const x = (event.clientX - bounds.left) / bounds.width * 2 - 1;
    const y = (event.clientY - bounds.top) / bounds.height * 2 - 1;
    portrait.style.transform = `perspective(900px) rotateX(${-y * maxTilt}deg) rotateY(${x * maxTilt}deg) scale(1.1)`;
});

wrapper.addEventListener("pointerleave", resetPortrait);
wrapper.addEventListener("pointercancel", resetPortrait);
motion.addEventListener("change", resetPortrait);
window.addEventListener("blur", resetPortrait);
