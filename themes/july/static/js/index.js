document.addEventListener("DOMContentLoaded", function ()
{
    const cards = document.querySelectorAll(".animated-card");

    cards.forEach((card) => {
        const glareEffect = card.querySelector(".glare-effect");

        card.addEventListener("mousemove", function (e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -15;
            const rotateY = ((x - centerX) / centerX) * 15;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
            card.style.boxShadow = `0 25px 50px -12px rgba(0, 0, 0, 0.25)`;

            const glareX = (x / rect.width) * 100;
            const glareY = (y / rect.height) * 100;
            glareEffect.style.transform = `translate(${glareX - 50}%, ${glareY - 50}%)`;
        });

        card.addEventListener("mouseleave", function () {
            card.style.transform =
            "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
            card.style.boxShadow =
            "0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)";
            glareEffect.style.transform = "translate(-50%, -50%)";
        });
    });
});