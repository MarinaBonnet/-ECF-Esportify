import { protectRoutes } from "../commun/routeur.js";

protectRoutes();

let currentIndex = 0;
let autoSlideInterval;

export function initMatchCarousel(matches) {
  const track = document.querySelector("[data-slider-wrapper]");
  const prevBtn = document.querySelector('[data-slider="prev"]');
  const nextBtn = document.querySelector('[data-slider="next"]');
  const counter = document.querySelector("[data-slider-counter]");

  if (!track || !prevBtn || !nextBtn || !counter) return;

  setupCarouselNavigation(matches, track, prevBtn, nextBtn, counter);

  window.addEventListener("resize", () => {
    setupCarouselNavigation(matches, track, prevBtn, nextBtn, counter);
  });

  // Auto-slide desktop only
  if (window.innerWidth >= 768) {
    startAutoSlide(matches, track, counter);
    track.addEventListener("mouseenter", stopAutoSlide);
    track.addEventListener("mouseleave", () =>
      startAutoSlide(matches, track, counter)
    );
  }
}

function setupCarouselNavigation(matches, track, prevBtn, nextBtn, counter) {
  const isMobile = window.innerWidth < 768;

  prevBtn.replaceWith(prevBtn.cloneNode(true));
  nextBtn.replaceWith(nextBtn.cloneNode(true));

  const newPrev = document.querySelector('[data-slider="prev"]');
  const newNext = document.querySelector('[data-slider="next"]');

  if (isMobile) {
    newPrev.addEventListener("click", () => {
      track.scrollBy({ left: -300, behavior: "smooth" });
    });
    newNext.addEventListener("click", () => {
      track.scrollBy({ left: 300, behavior: "smooth" });
    });
  } else {
    newPrev.addEventListener("click", () => {
      currentIndex = Math.max(0, currentIndex - 1);
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      updateCounter(counter, currentIndex, matches.length);
    });
    newNext.addEventListener("click", () => {
      currentIndex = Math.min(matches.length - 1, currentIndex + 1);
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      updateCounter(counter, currentIndex, matches.length);
    });
    updateCounter(counter, currentIndex, matches.length);
  }
}

function startAutoSlide(matches, track, counter) {
  stopAutoSlide(); // clear any existing
  autoSlideInterval = setInterval(() => {
    currentIndex = (currentIndex + 1) % matches.length;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    updateCounter(counter, currentIndex, matches.length);
  }, 5000);
}

function stopAutoSlide() {
  clearInterval(autoSlideInterval);
}

function updateCounter(counter, index, total) {
  counter.textContent = `${index + 1} / ${total}`;
}

export function createCarouselSlide(match) {
  return `
    <article class="item-photo" data-id="${match.id}">
        <span class="badge-status ${match.status.toLowerCase()}">${
    match.status
  }</span>
        <img src="${match.image}" alt="Tournoi ${match.title}" class="photo" />
        <h3>${match.title}</h3>
        <p>👥 ${match.players.length} joueurs</p>
        <p>📅 ${formatDate(match.date)}</p>
        <button class="btn-details" data-id="${match.id}">Voir détails</button>
    </article>
    `;
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
