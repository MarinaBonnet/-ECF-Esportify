import { showLoader, hideLoader } from "./loader.js";

const games = {
  yamzilla: { name: "Yamzilla", src: "./yamzilla/index.html" },
  aimtrainer: { name: "Aim Trainer", src: "./aimtrainer/index.html" },
  chessreflex: { name: "Chess Reflex", src: "./chessreflex/index.html" },
};

export function loadGame(
  gameId,
  containerSelector,
  titleSelector = "#game-title",
  loaderId = "game-loader"
) {
  const container = document.querySelector(containerSelector);
  const titleEl = document.querySelector(titleSelector);

  if (!container) return;

  showLoader(loaderId, "Chargement du jeu...");

  if (!games[gameId]) {
    container.innerHTML = `<p>🎮 Jeu inconnu ou non disponible.</p>`;
    if (titleEl) titleEl.textContent = "Jeu inconnu";
    hideLoader(loaderId);
    return;
  }

  container.innerHTML = "";
  if (titleEl) titleEl.textContent = games[gameId].name;

  const iframe = document.createElement("iframe");
  iframe.src = games[gameId].src;
  iframe.width = "100%";
  iframe.height = "600";
  iframe.style.border = "none";
  iframe.allow = "autoplay";

  iframe.onload = () => hideLoader(loaderId);
  container.appendChild(iframe);
}
