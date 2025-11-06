export function initCarousel() {
    // Sélection des éléments
    const carousel = document.querySelector(".img-photo-jeux");
    const prevBtn = document.querySelector('.navigation-item[data-slider="prev"]');
    const nextBtn = document.querySelector('.navigation-item[data-slider="next"]');

    if (!carousel || !prevBtn || !nextBtn) return;

    // Paramètres
    const scrollAmount = window.innerWidth < 768 ? 200 : 300;
    const autoplayDelay = 4000;
    let autoplayInterval;

    // Fonction pour défiler
    function scrollCarousel(direction) {
        if (direction === "next") {
            if (carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 10) {
                carousel.scrollTo({ left: 0, behavior: "smooth" });
            } else {
                carousel.scrollBy({ left: scrollAmount, behavior: "smooth" });
            }
        } else if (direction === "prev") {
            if (carousel.scrollLeft <= 0) {
                carousel.scrollTo({ left: carousel.scrollWidth, behavior: "smooth" });
            } else {
                carousel.scrollBy({ left: -scrollAmount, behavior: "smooth" });
            }
        }
    }

    // Autoplay
    function startAutoplay() {
        autoplayInterval = setInterval(() => {
            scrollCarousel("next");
        }, autoplayDelay);
    }

    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }

    function restartAutoplay() {
        stopAutoplay();
        startAutoplay();
    }

    // Écouteurs
    nextBtn.addEventListener("click", () => {
        scrollCarousel("next");
        restartAutoplay();
    });

    prevBtn.addEventListener("click", () => {
        scrollCarousel("prev");
        restartAutoplay();
    });

    carousel.addEventListener("mouseenter", stopAutoplay, { passive: true });
    carousel.addEventListener("mouseleave", startAutoplay, { passive: true });
    carousel.addEventListener("touchstart", stopAutoplay, { passive: true });
    carousel.addEventListener("touchend", startAutoplay, { passive: true });

    // Lancer l’autoplay au chargement
    startAutoplay();
}
export function updateCarouselContent(events) {
    const wrapper = document.querySelector("[data-slider-wrapper]");
    if (!wrapper) return;

    wrapper.innerHTML = "";

    for (const event of events) {
        if (!event.isVisible) continue;

        const article = document.createElement("article");
        article.className = "item-photo";
        article.dataset.id = event.id;

        article.innerHTML = `
      <img src="${event.image}" alt="${event.title}" class="photo" />
    `;

        wrapper.appendChild(article);
    }
}
