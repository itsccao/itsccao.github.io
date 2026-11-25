const wrapper = document.querySelector(".home-portrait-trigger");
const portrait = wrapper.querySelector(".home-portrait");
const dialog = document.getElementById("portrait-dialog");
const motion = matchMedia("(min-width: 50rem) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
const maxTilt = 8;

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
    portrait.style.transform = `perspective(900px) rotateX(${-y * maxTilt}deg) rotateY(${x * maxTilt}deg) scale(1.03)`;
});

wrapper.addEventListener("pointerleave", resetPortrait);
wrapper.addEventListener("pointercancel", resetPortrait);
motion.addEventListener("change", resetPortrait);
window.addEventListener("blur", resetPortrait);

wrapper.addEventListener("click", () => {
    resetPortrait();
    dialog.showModal();
});

dialog.addEventListener("click", event => {
    if (event.target === dialog) dialog.close();
});

const sectionNav = document.querySelector(".home-section-nav");
const sections = Array.from(sectionNav.querySelectorAll("a"), link => ({
    link,
    section: document.querySelector(link.hash),
}));
const desktop = matchMedia("(min-width: 60rem)");

function updateActiveSection() {
    if (!desktop.matches) return;

    const midpoint = window.innerHeight / 2;
    const current = sections.find(({ section }) => {
        const { top, bottom } = section.getBoundingClientRect();
        return top <= midpoint && bottom > midpoint;
    });
    if (!current || current.link.hasAttribute("aria-current")) return;

    sectionNav.querySelector("[aria-current]")?.removeAttribute("aria-current");
    current.link.setAttribute("aria-current", "location");
    sectionNav.style.setProperty("--active-section", sections.indexOf(current));
}

window.addEventListener("scroll", updateActiveSection, { passive: true });
window.addEventListener("resize", updateActiveSection);
updateActiveSection();
