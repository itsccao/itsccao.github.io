document.addEventListener("DOMContentLoaded", function ()
{
    const cards = document.querySelectorAll(".index-card");

    cards.forEach((card) => {
        card.addEventListener("mousemove", function (e) {
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
                `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.06)`;
        });

        card.addEventListener("mouseleave", function () {
            card.classList.remove("glow");
            card.style.transform =
            "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
        });
    });
});