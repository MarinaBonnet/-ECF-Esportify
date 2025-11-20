import { initAvatarMenu } from "./js/modules/profile/avatarMenu.js";
import { initEventForm } from "./js/modules/events/eventForm.js";
import { initEventActions } from "./js/modules/events/eventActions.js";
import { initAdminTabs } from "./js/modules/admin/adminTabs.js";
import { initSidebar } from "./js/modules/commun/sidebar.js";
import { initMobileMenu } from "./js/modules/commun/common.js";
import { initIntro } from "./js/modules/commun/intro.js";
import { initBanner } from "./js/modules/commun/banner.js";
import { initCarousel, renderCarousel } from "./js/modules/commun/carousel.js"; // ✅ les deux
import { initForms } from "./js/forms/index.js";
import { initPopupJeu } from "./js/modules/commun/popupJeu.js";
import { createDevOverlay } from "./js/helpers/devOverlay.js";
import {
  createDevConsole,
  logToDevConsole,
  toggleDevConsole,
} from "./js/helpers/devConsole.js";
import {
  renderMatches,
  setupCategoryFilter,
  setupDetailsPopup,
} from "./js/modules/UI/matchUI.js";
import {
  joinMatch,
  unsubscribeMatch,
  addPlayerToMatch,
} from "./js/modules/match/matchManager.js";
import { initMatchCarousel } from "./js/modules/match/matchCarousel.js";
import { loadGame } from "./js/modules/gameLoader.js";
import { initProfile } from "./js/modules/profile/index.js";
import { initStatusManager } from "./js/modules/status/statusManager.js";
import {
  initPlayerStats,
  initScoreTracker,
} from "./js/modules/profile/playersStats.js";
import { initEventModeration } from "./js/modules/events/eventModeration.js";
import { protectRoutes } from "./js/modules/commun/routeur.js";
import {
  renderFavoritesSection,
  renderFavoriteButton,
} from "./js/modules/UI/favoritesUI.js";
import { calculateScore } from "./js/helpers/favoritesManagers.js";
import { openModalAndValidate } from "./js/modules/modal.js";

document.addEventListener("DOMContentLoaded", () => {
  const main = document.querySelector("main");
  const role = document.body.dataset.role;
  const username = main?.dataset.username || "Anonyme";
  const gameId = main?.dataset.game;
  const pageType = main?.classList.contains("game-page") ? "game" : "standard";
  const userId = 1; // ⚠️ à remplacer par l’ID réel

  initFavoris(userId);
  initRoleFeatures(role, username);
  initGlobalUI();
  if (pageType === "game" && gameId) initGamePage(gameId, username);
  initMatchFeatures(username);
  initFormTests();
  setupChatListener();
  setupKeyboardShortcuts();
  if (isLocalEnv()) initDevMode();
});

// --- Favoris ---
function initFavoris(userId) {
  const favorisContainer = document.getElementById("favoris-container");
  if (favorisContainer) renderFavoritesSection(userId, favorisContainer);

  const scoreContainer = document.getElementById("score-container");
  if (scoreContainer) scoreContainer.textContent = `Score: ${calculateScore()}`;

  const matchCard = document.getElementById("match-42");
  if (matchCard) {
    const favBtn = renderFavoriteButton(userId, 42);
    matchCard.appendChild(favBtn);
  }
}

// --- Roles ---
function initRoleFeatures(role, username) {
  const dashboardTab = document.querySelector("#dashboard");

  // Admin → accès complet
  if (role === "admin" && dashboardTab) {
    initStatusManager();
    initEventModeration(role);
    if (document.querySelector("#event-form")) initEventForm();
    if (document.querySelector(".event-actions")) initEventActions();
    if (document.querySelector("#organizer-tools")) organizerTools(); // admin peut aussi voir
  }

  // Organisateur → accès aux événements + organizerTools
  if (role === "organisateur") {
    initEventModeration(role);
    if (document.querySelector("#event-form")) initEventForm();
    if (document.querySelector(".event-actions")) initEventActions();
    if (document.querySelector("#organizer-tools")) organizerTools(); // ✅ outils organisateur
  }

  // Joueur → accès uniquement au formulaire de création
  if (role === "joueur") {
    initPlayerStats();
    if (document.querySelector("#event-form")) initEventForm();
    // ⚠️ pas d’actions, pas de modération, pas d’organizerTools
  }

  // Visiteur → accès limité (newsletter, inscription, contact)
  if (role === "visiteur" || !role) {
    console.log(
      "ℹ️ Mode visiteur : accès limité (newsletter, inscription, contact)."
    );
  }

  // Avatar menu si présent
  if (document.querySelector("#avatar-name")) {
    initProfile(role, username);
    initAvatarMenu(role);
  }
}

// --- UI global ---
function initGlobalUI() {
  protectRoutes();
  initSidebar();
  initMobileMenu();
  initForms();
  initIntro();
  initBanner();

  // ✅ Carrousel global (images accueil)
  // ✅ Charger les événements depuis events.json
  fetch("data/events.json")
    .then((response) => response.json())
    .then((events) => {
      // Appel à renderCarousel avec les données
      renderCarousel(events);
    })
    .catch((err) =>
      console.error("Erreur de chargement des événements :", err)
    );

  initPopupJeu({
    wrapperSelector: "[data-slider-wrapper]",
    popupId: "event-popup",
    contentId: "popup-content",
    dataSource: "data/events.json", // ✅ chemin corrigé
  });

  if (document.querySelector(".admin-tabs")) initAdminTabs();
  if (document.querySelector("#event-form")) initEventForm();
  if (document.querySelector(".event-actions")) initEventActions();
}

// --- Page du jeu ---
function initGamePage(gameId, username) {
  loadGame(gameId, "#game-container");
  const chatForm = document.getElementById("chat-form");
  if (chatForm) initChatUI(username);
}

// --- Matchs + carrousel des matchs ---
function initMatchFeatures(username) {
  if (document.querySelector('[data-status="en-cours"]')) {
    renderMatches();
    initMatchCarousel(); // ✅ carrousel des matchs
    setupCategoryFilter();
    setupDetailsPopup();
    initScoreTracker();
  }
}

// --- Dev mode ---
function isLocalEnv() {
  return location.hostname === "127.0.0.1" || location.port === "5500";
}

function initDevMode() {
  createDevOverlay();
  createDevConsole();
  logToDevConsole("🧪 DevConsole initialisée");
  logToDevConsole("🔄 Chargement des modules...");
}

// --- Listeners ---
function setupChatListener() {
  window.addEventListener("message", (event) => {
    if (event.origin !== "http://127.0.0.1:5500") return;
    if (event.data?.type === "chat") {
      const chatBox = document.getElementById("chat-message");
      if (chatBox) {
        const msg = document.createElement("p");
        msg.textContent = event.data.message;
        msg.classList.add("chat-system-message");
        chatBox.appendChild(msg);
        chatBox.scrollTop = chatBox.scrollHeight;
      }
    }
  });
}

function setupKeyboardShortcuts() {
  document.addEventListener("keydown", (e) => {
    if (e.key === "`") toggleDevConsole();
    logToDevConsole("🧪 Mode Dev actif");
  });
}

function initFormTests() {
  const testButtons = document.querySelectorAll(".test-form");
  for (const btn of testButtons) {
    btn.addEventListener("click", () => {
      const targetId = btn.dataset.target;
      openModalAndValidate(targetId);
    });
  }
}
