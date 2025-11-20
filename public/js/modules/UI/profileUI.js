import { fetchStats, fetchFavorites, fetchHistory } from "./profilData.js";
import {
  createStatCard,
  createFavoriteCard,
  createHistoryCard,
} from "./profilHelpers.js";

export async function renderStats(username) {
  const statsSection = document.getElementById("stats-section");
  if (!statsSection) return;

  const stats = await fetchStats(username);
  statsSection.innerHTML = ""; // reset

  for (const stat of stats) {
    const card = createStatCard(stat);
    statsSection.querySelector(".stats-grid")?.appendChild(card);
  }
}

export async function renderFavorites(username) {
  const favoritesSection = document.getElementById("favorites-section");
  if (!favoritesSection) return;

  const favorites = await fetchFavorites(username);
  favoritesSection.innerHTML = ""; // reset

  for (const fav of favorites) {
    const card = createFavoriteCard(fav);
    favoritesSection.appendChild(card);
  }
}

export async function renderHistory(username) {
  const historySection = document.getElementById("history-section");
  if (!historySection) return;

  const history = await fetchHistory(username);
  const list = historySection.querySelector(".event-list");
  list.innerHTML = ""; // reset

  for (const ev of history) {
    const card = createHistoryCard(ev);
    list.appendChild(card);
  }
}
