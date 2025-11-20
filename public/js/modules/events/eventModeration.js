import { initEventActions } from "./eventActions.js";
import { canEdit, getUserInfo } from "../permissions.js";
import { protectRoutes } from "../commun/routeur.js";
protectRoutes();

export async function initEventModeration(role, statut = "en attente") {
  const container = document.querySelector(".event-moderation");
  if (!container) return;

  const endpoint = role === "admin" ? "all" : "pending";
  const res = await fetch(`api/core/EventFetcher.php?action=${endpoint}`);
  const data = await res.json();
  if (!data.success) {
    afficherMessage(`❌ Erreur : ${data.error}`, "error");
    return;
  }

  const events = data.events;
  updateCounters(events);
  container.innerHTML = "";

  for (const ev of events) {
    if (ev.statut !== statut) continue;

    const card = document.createElement("div");
    card.className = "event-card";

    const modifBadge = ev.derniere_modification
      ? `<p class="modif-badge">🔄 Modifié par <strong>${
          ev.modifie_par
        }</strong> le ${formatDate(ev.derniere_modification)}</p>`
      : "";

    card.innerHTML = `
      <h4>${ev.nom} (${ev.jeu})</h4>
      <p><strong>Date :</strong> ${ev.date}</p>
      <p>${ev.description}</p>
      <p><strong>Proposé par :</strong> ${ev.joueur_proposeur}</p>
      <p><strong>Statut :</strong> ${ev.statut}</p>
      ${modifBadge}
      <div class="actions"></div>
    `;

    const actions = card.querySelector(".actions");

    if (canEdit(role)) {
      actions.appendChild(
        createActionButton("✏️ Modifier", () => openEditModal(ev))
      );
      actions.appendChild(
        createActionButton("✅ Valider", () => validateEvent(ev.id, card))
      );
      actions.appendChild(
        createActionButton("❌ Refuser", () => rejectEvent(ev.id, card))
      );
      actions.appendChild(
        createActionButton("🗑️ Supprimer", () => deleteEvent(ev.id, card))
      );
    }

    container.appendChild(card);
  }
}

export async function chargerEvenements(statut = "pending") {
  const res = await fetch(`api/core/EventFetcher.php?action=${statut}`);
  const data = await res.json();
  if (data.success) {
    afficherCartes(data.events);
  } else {
    afficherMessage(`❌ Erreur : ${data.error}`, "error");
  }
}

export async function chargerEvenementsInscrits() {
  const { id } = getUserInfo();
  const res = await fetch("api/core/EventFetcher.php?action=joined", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: id }),
  });

  const data = await res.json();
  if (data.success) {
    afficherCartes(data.events);
  } else {
    afficherMessage(`❌ ${data.error}`, "error");
  }
}

function createActionButton(label, handler) {
  const btn = document.createElement("button");
  btn.textContent = label;
  btn.addEventListener("click", handler);
  return btn;
}

function updateCounters(events) {
  bumpBadge("count-attente", countByStatut(events, "en attente"));
  bumpBadge("count-valide", countByStatut(events, "validé"));
  bumpBadge("count-refuse", countByStatut(events, "refusé"));
}

function countByStatut(events, statut) {
  return events.filter((ev) => ev.statut === statut).length;
}

function bumpBadge(id, value) {
  const badge = document.getElementById(id);
  if (badge && badge.textContent !== String(value)) {
    badge.textContent = value;
    badge.classList.add("bump");
    setTimeout(() => badge.classList.remove("bump"), 400);
  }
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
