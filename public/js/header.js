const root = document.documentElement;
const themeButton = document.querySelector(".page-theme-toggle");
const navigation = document.querySelector(".page-nav");
const indicator = navigation.querySelector(".page-nav-indicator");
const homeLink = navigation.querySelector("[data-home]");
const contactLink = navigation.querySelector("[data-contact]");

function updateThemeButton() {
    themeButton.setAttribute("aria-pressed", root.dataset.theme === "dark");
}

updateThemeButton();
themeButton.hidden = false;
root.classList.add("theme-motion-ready");

themeButton.addEventListener("click", () => {
    const theme = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = theme;
    updateThemeButton();
    try {
        localStorage.setItem("pageTheme", theme);
    } catch {}
});

function updateNavigation() {
    if (homeLink.getAttribute("href") === "#intro") {
        if (location.hash === "#contact") {
            homeLink.removeAttribute("aria-current");
            contactLink.setAttribute("aria-current", "location");
        } else {
            contactLink.removeAttribute("aria-current");
            homeLink.setAttribute("aria-current", "page");
        }
    }

    const active = navigation.querySelector("[aria-current]");
    if (active) {
        indicator.style.width = active.offsetWidth + "px";
        indicator.style.transform = "translateX(" + active.offsetLeft + "px)";
    }
    navigation.classList.toggle("has-indicator", Boolean(active));
}

updateNavigation();
window.addEventListener("hashchange", updateNavigation);
const resizeObserver = new ResizeObserver(updateNavigation);
navigation.querySelectorAll("a").forEach(link => resizeObserver.observe(link));
