import { protectRoutes } from "../commun/routeur.js";
protectRoutes();

// composant visuelle carte de match
export function createMatchCard(match) {
  const card = document.createElement("article");
  card.className = "event-card";
  card.style.animationDelay = `${index * 100}ms`; // effet en cascade

  const playersList = match.players.map((p) => `<li>${p}</li>`).join("");

  card.innerHTML = `
    <img src="${match.image}" alt="Tournoi ${match.title}" class="event-img">
    <div class="event-details">
    <h4>${match.title}</h4>
    <p>Date : ${new Date(match.date).toLocaleDateString()}</p>
    <p>Heure : ${new Date(match.date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}</p>
    <p>Catégorie : ${match.category}</p>
    <p>Statut : ${match.status}</p>
    ${
      match.status === "À venir"
        ? `<p class="timer" data-date="${match.date}">⏳ Chargement du timer...</p>`
        : ""
    }
    <div class="players">
        <strong>Joueurs inscrits :</strong>
        <ul>${playersList}</ul>
    </div>
    <div class="event-actions">
        ${
          match.status === "À venir"
            ? `<button class="btn-subscribe" data-id="${match.id}">S'inscrire</button>`
            : `<button class="btn-view">Voir</button>
            <button class="join-event" data-id="${match.id}">Rejoindre</button>`
        }
        <button class="btn-unsubscribe" data-id="${
          match.id
        }">Se désinscrire</button>
    </div>
    </div>
`;
  return card;
}
