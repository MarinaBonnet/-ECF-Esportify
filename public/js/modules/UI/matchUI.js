import { fetchMatches } from "../match/matchData.js";
import { createMatchCard } from "../match/matchCard.js";

// 🔹 Nettoyage des sections
function clearSectionContent(section) {
  if (!section) return;
  for (const card of section.querySelectorAll(".event-card")) {
    card.remove();
  }
  const oldMsg = section.querySelector(".no-match");
  if (oldMsg) oldMsg.remove();
}

// 🔹 Filtrage par catégorie et statut
function matchIsVisible(match, category, status) {
  const matchCategory = (match.category || "").toLowerCase();
  const matchStatus = (match.status || "").toLowerCase();

  const categoryOk =
    !category || matchCategory.includes(category.toLowerCase());
  const statusOk = !status || matchStatus === status.toLowerCase();

  return categoryOk && statusOk;
}

// 🔹 Message si aucun match
function displayNoMatchMessage(sections) {
  for (const section of Object.values(sections)) {
    const msg = document.createElement("p");
    msg.className = "no-match";
    msg.textContent = "😢 Aucun tournoi trouvé";
    section.appendChild(msg);
  }
}

// 🔹 Compte à rebours optimisé
function startCountdownTimers() {
  const timers = document.querySelectorAll(".timer");

  for (const timer of timers) {
    const targetDate = new Date(timer.dataset.date);

    function update() {
      const now = new Date();
      const diff = targetDate - now;

      if (diff <= 0) {
        timer.textContent = "🚀 Le tournoi commence !";
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      timer.textContent = `⏳ Débute dans ${hours}h ${minutes}m ${seconds}s`;
    }

    update();
    setInterval(update, 1000);
  }
}

// 🔹 Rendu des matchs (unique version)
export async function renderMatches(category = "", status = "") {
  const sections = {
    "en cours": document.querySelector('[data-status="en-cours"]'),
    "à venir": document.querySelector('[data-status="a-venir"]'),
  };

  for (const section of Object.values(sections)) {
    if (section) clearSectionContent(section);
  }

  const matches = await fetchMatches(); // 🔹 récupère depuis API

  let found = false;

  for (const [i, match] of matches.entries()) {
    const isVisible = matchIsVisible(match, category, status);
    const section = sections[match.status.toLowerCase()];

    if (isVisible && section) {
      const card = createMatchCard(match, i);
      section.appendChild(card);
      found = true;
    }
  }
  if (found) {
    startCountdownTimers();
  } else {
    displayNoMatchMessage(sections);
  }
}

// 🔹 Filtres catégorie/statut
export function setupCategoryFilter() {
  const input = document.getElementById("category");
  const statusSelect = document.getElementById("status");
  const button = document.querySelector(".search-btn");

  function applyFilters() {
    const category = input?.value.trim() || "";
    const status = statusSelect?.value || "";
    renderMatches(category, status);
  }

  button?.addEventListener("click", applyFilters);
  input?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") applyFilters();
  });
  statusSelect?.addEventListener("change", applyFilters);
}

// 🔹 Popup détails
export function setupDetailsPopup() {
  document.addEventListener("click", async (e) => {
    if (e.target.classList.contains("btn-details")) {
      const matchId = e.target.dataset.id;
      const matches = await fetchMatches(); // 🔹 récupère depuis API
      const match = matches.find((m) => m.id === matchId);
      if (match) openMatchPopup(match);
    }
  });
}
