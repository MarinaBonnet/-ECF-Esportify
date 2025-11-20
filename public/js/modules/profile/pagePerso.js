// pagePerso.js
import { getUserInfo } from "../permissions.js";
import { initProfile, appliquerVisibiliteParRole } from "./profile/index.js";
import { initEventForm } from "./eventEditor.js";
import { initScoreTracker } from "./scoreTrackers.js";
import { getFavorites, renderScore } from "./favoritesManager.js";
import { fetchStats, fetchHistory } from "./profile/profilData.js";
import {
  createStatCard,
  createFavoriteCard,
  createHistoryCard,
  animateProfileCard,
} from "./profileHelpers.js";

document.addEventListener("DOMContentLoaded", async () => {
  const { id, role, username } = getUserInfo();

  if (!id) {
    location.href = "login.html";
    return;
  }

  // 🔹 Profil & rôle
  appliquerVisibiliteParRole(role);
  initProfile(role, username);

  // 🔹 Stats perso (via ProfileFetcher)
  try {
    const stats = await fetchStats(username);
    const grid = document.querySelector(".stats-grid");
    if (grid) {
      grid.innerHTML = "";
      // ✅ for...of au lieu de forEach
      for (const stat of stats) {
        const card = createStatCard(stat);
        grid.appendChild(card);
        animateProfileCard(card);
      }
    }
  } catch (err) {
    console.error("Erreur stats :", err);
  }

  // 🔹 Classement global
  initScoreTracker();

  // 🔹 Favoris
  try {
    const favs = await getFavorites(id);
    const favContainer = document.querySelector("#favoris-container");
    if (favContainer) {
      favContainer.innerHTML = "";
      // ✅ for...of au lieu de forEach
      for (const fav of favs) {
        const card = createFavoriteCard(fav);
        favContainer.appendChild(card);
        animateProfileCard(card);
      }
    }
    renderScore();
  } catch (err) {
    console.error("Erreur favoris :", err);
  }

  // 🔹 Historique
  try {
    const history = await fetchHistory(username);
    const historyContainer = document.querySelector("#history-container");
    if (historyContainer) {
      historyContainer.innerHTML = "";
      // ✅ for...of au lieu de forEach
      for (const ev of history) {
        const card = createHistoryCard(ev);
        historyContainer.appendChild(card);
        animateProfileCard(card);
      }
    }
  } catch (err) {
    console.error("Erreur historique :", err);
  }

  // 🔹 Formulaire d’événement
  initEventForm();
});
