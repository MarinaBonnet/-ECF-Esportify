// modules/matchPopup.js
import { fetchMatches } from "./matchData.js";
import { canViewEvents, getUserRole } from "../permissions.js";

export async function renderGlobalMatches(category = "", status = "") {
  const container = document.getElementById("global-carousel");
  if (!container) return;

  container.innerHTML = ""; // reset

  try {
    const matches = await fetchMatches();
    const role = getUserRole();

    // 🔹 Filtrage côté front
    const filtered = matches.filter((match) => {
      const catOk =
        !category ||
        match.category.toLowerCase().includes(category.toLowerCase());
      const statusOk =
        !status || match.status.toLowerCase() === status.toLowerCase();
      return catOk && statusOk;
    });

    if (filtered.length === 0) {
      container.innerHTML = "<p class='no-match'>😢 Aucun tournoi trouvé</p>";
      return;
    }

    for (const match of filtered) {
      const card = document.createElement("div");
      card.className = "carousel-card";

      // Vue publique (toujours visible)
      card.innerHTML = `
        <h3>${match.title}</h3>
        <p>📅 Date : ${formatDate(match.date)}</p>
      `;

      // Vue privée (infos supplémentaires si rôle autorisé)
      if (canViewEvents(role)) {
        card.innerHTML += `
          <p>👥 Joueurs : ${(match.players || []).length}</p>
          <p>Statut : ${match.status}</p>
        `;
      }

      // Popup léger au clic
      card.addEventListener("click", () => {
        renderGlobalPopup(match, role);
      });

      container.appendChild(card);
    }
  } catch (err) {
    console.error("Erreur chargement matchs :", err);
    container.innerHTML = "<p>⚠️ Impossible de charger les tournois</p>";
  }
}

function renderGlobalPopup(match, role) {
  const popup = document.getElementById("event-popup");
  const popupContent = document.getElementById("popup-content");

  // Vue publique
  popupContent.innerHTML = `
    <h2>${match.title}</h2>
    <p>📅 Date : ${formatDate(match.date)}</p>
    <img src="${match.image}" alt="${match.title}" />
  `;

  // Vue privée (infos supplémentaires si rôle autorisé)
  if (canViewEvents(role)) {
    popupContent.innerHTML += `
      <p>👥 Joueurs : ${(match.players || []).length}</p>
      <p>Statut : ${match.status}</p>
    `;
  }

  popup.showModal();
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
