// index.js
import { initAvatarMenu } from "./avatarMenu.js";
import { renderFavoritesSection } from "../UI/favoritesUI.js";

// 🔹 Visibilité par rôle (fusionné depuis roleVisibility.js)
export function initRoleVisibility(role) {
  for (const el of document.querySelectorAll("[data-visible-for]")) {
    const roles = el.dataset.visibleFor.split(",").map((r) => r.trim());
    el.classList.toggle("hidden", !roles.includes(role));
  }
}

// 🔹 Role badge (fusionné ici)
function renderRoleBadge(role) {
  const badgeContainer = document.querySelector(".role-badge-container");
  if (!badgeContainer) return;

  const badge = document.createElement("span");
  badge.className = `role-badge role-${role.toLowerCase()}`;
  badge.textContent = role;

  badgeContainer.innerHTML = ""; // reset
  badgeContainer.appendChild(badge);
}

export function initProfile(role, username) {
  const profileWrapper = document.querySelector(".profile-wrapper");
  if (!profileWrapper) return;

  // Section Favoris
  const favoritesSection = document.createElement("section");
  favoritesSection.className = "profile-block favorites-block";
  profileWrapper.appendChild(favoritesSection);

  renderFavoritesSection(username, favoritesSection);
  initAvatarMenu(role);
  renderRoleBadge(role); // 🔹 badge affiché
  renderBadges(username);
  renderStats(username);
  initProfileEditor(username);

  initRoleVisibility(role); // 🔹 visibilité appliquée
}
