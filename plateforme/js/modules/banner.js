
export function initBanner() {
    const phrases = [
        "Esport Tournois Français",
        "Compétitions en Ligne",
        "Tournois Multijoueurs",
        "Classements et Récompenses",
    ];

    const banner = document.querySelector(".baseline-title-dynamique");
    if (!banner) return;

    let index = 0;
    function updateBanner() {
        banner.textContent = phrases[index];

        //banner.classList.remove("scrollText");
        // Force reflow if needed: void banner.offsetHeight;
        //banner.classList.add("scrollText");
        index = (index + 1) % phrases.length;
    }

    setInterval(updateBanner, 2000);
};