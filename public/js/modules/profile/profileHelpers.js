import {
  createStatCard,
  createFavoriteCard,
  createHistoryCard,
} from "./profileHelper.js";

// Exemple pour les stats
const grid = document.querySelector(".stats-grid");
for (const stat of stats) {
  grid.appendChild(createStatCard(stat));
}

// Exemple pour les favoris
const favContainer = document.querySelector("#favoris-container");
for (const fav of favorites) {
  favContainer.appendChild(createFavoriteCard(fav));
}

// Exemple pour l’historique
const historyContainer = document.querySelector("#history-container");
for (const ev of history) {
  historyContainer.appendChild(createHistoryCard(ev));
}
