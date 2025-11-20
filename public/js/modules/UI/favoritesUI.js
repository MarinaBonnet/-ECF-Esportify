// favoritesUI.js
import {
  getFavorites,
  removeFavorite,
  toggleFavorite,
  updateFavorite,
  calculateScore,
} from "../../helpers/favoritesManagers.js";
import { fetchMatches, getMatches } from "../../modules/match/matchData.js";
import { loadGame } from "../gameLoader.js";

function showMessage(container, message, type = "info") {
  const msg = document.createElement("div");
  msg.className = `alert alert-${type}`;
  msg.textContent = message;
  container.prepend(msg);
  setTimeout(() => msg.remove(), 3000);
}

function renderScore() {
  const scoreContainer = document.getElementById("score-container");
  if (scoreContainer) {
    scoreContainer.textContent = `Score: ${calculateScore()}`;
  }
}

export async function renderFavoritesSection(userId, container) {
  if (!container) return;

  const favorites = await getFavorites(userId);
  const favoriteMatches = matches.filter((match) =>
    favorites.some((f) => f.id === match.id)
  );

  container.innerHTML = "<h3>⭐ Mes événements favoris</h3>";

  if (favoriteMatches.length === 0) {
    container.innerHTML += "<p>Aucun événement favori pour le moment.</p>";
    return;
  }

  const list = document.createElement("ul");
  list.className = "favorites-list";

  for (const match of favoriteMatches) {
    const item = document.createElement("li");
    item.className = "favorite-item";
    item.innerHTML = `<strong>${match.title}</strong><br>🗓️ ${match.date} – 👥 ${match.players.length} joueurs`;

    // Retirer
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Retirer";
    removeBtn.className = "btn-remove-favorite";
    removeBtn.addEventListener("click", async () => {
      const result = await removeFavorite(userId, match.id);
      if (result.success) {
        item.remove();
        showMessage(container, "Favori retiré", "success");
        renderScore();
      } else {
        showMessage(container, result.error, "error");
      }
    });

    // Modifier
    const editBtn = document.createElement("button");
    editBtn.textContent = "Modifier";
    editBtn.className = "btn-edit-favorite";
    editBtn.addEventListener("click", async () => {
      const newNom = prompt("Nouveau nom du favori", match.title);
      const newUrl = prompt("Nouvelle URL du favori", match.url || "#");
      const newCat = prompt("Nouvelle catégorie", match.categorie || "match");

      if (newNom && newUrl && newCat) {
        const result = await updateFavorite(
          userId,
          match.id,
          newNom,
          newUrl,
          newCat
        );
        if (result.success) {
          showMessage(container, "Favori mis à jour", "success");
          await renderFavoritesSection(userId, container);
          renderScore();
        } else {
          showMessage(container, result.error, "error");
        }
      }
    });

    // Rejoindre
    const now = new Date();
    const startTime = new Date(match.start);
    if (now >= startTime && match.started) {
      const joinBtn = document.createElement("button");
      joinBtn.textContent = "Rejoindre";
      joinBtn.className = "btn-join-match";
      joinBtn.addEventListener("click", () =>
        loadGame(match.id, "#game-container")
      );
      item.appendChild(joinBtn);
    }

    item.appendChild(editBtn);
    item.appendChild(removeBtn);
    list.appendChild(item);
  }

  container.appendChild(list);
  renderScore();
}

export async function renderFavoriteButton(userId, eventId) {
  const btn = document.createElement("button");
  btn.className = "favorite-btn";
  btn.textContent = (await isFavorite(userId, eventId)) ? "★" : "☆";

  btn.addEventListener("click", async () => {
    const result = await toggleFavorite(userId, eventId);
    if (result.success) {
      btn.textContent = (await isFavorite(userId, eventId)) ? "★" : "☆";
      btn.classList.add("bump");
      setTimeout(() => btn.classList.remove("bump"), 300);
      renderScore();
    } else {
      showMessage(document.body, result.error, "error");
    }
  });

  return btn;
}
