// modules/eventActions.js

export function initEventActions() {
  console.log("initEventActions lancé");

  const cards = document.querySelectorAll(".event-card-favorite");
  const now = new Date();

  for (const card of cards) {
    console.log("Carte trouvée :", card);

    const startTime = new Date(card.dataset.start);
    const diff = startTime - now;

    toggleVisibility(
      card.querySelector(".join-btn"),
      now >= startTime,
      "join-btn"
    );
    toggleVisibility(
      card.querySelector(".start-btn"),
      diff <= 1800000 && diff > 0,
      "start-btn"
    );

    setupAction(
      card,
      ".btn-valider",
      validerEvenement,
      "validated",
      "✅ Événement validé"
    );
    setupAction(
      card,
      ".btn-rejeter",
      rejeterEvenement,
      "rejected",
      "🚫 Événement rejeté"
    );
    setupAction(
      card,
      ".btn-supprimer",
      supprimerEvenement,
      null,
      "🗑️ Événement supprimé",
      true
    );
    setupAction(
      card,
      ".join-btn",
      joinEvent,
      "joined",
      "🎉 Participation enregistrée"
    );
  }
}

function toggleVisibility(button, condition, label) {
  if (button && condition) {
    button.classList.remove("hidden");
    console.log(`${label} affiché`);
  }
}

function setupAction(
  card,
  selector,
  actionFn,
  successClass,
  successMsg,
  removeOnSuccess = false
) {
  const btn = card.querySelector(selector);
  if (!btn) return;

  btn.addEventListener("click", () => {
    actionFn(card.dataset.id).then((data) => {
      if (data.success) {
        console.log(successMsg);
        if (removeOnSuccess) {
          card.remove();
        } else if (successClass) {
          card.classList.add(successClass);
        }
      } else {
        console.error("❌ Erreur :", data.error);
      }
    });
  });
}

// 🔹 Helper générique
async function postToApi(url, payload) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return await response.json();
}

// 🔹 Appels API spécifiques
export async function validerEvenement(id) {
  return await postToApi("/api/core/EventManager.php?action=validate", { id });
}

export async function rejeterEvenement(id) {
  return await postToApi("/api/core/EventManager.php?action=reject", { id });
}

export async function supprimerEvenement(id) {
  return await postToApi("/api/core/EventManager.php?action=delete", { id });
}

export async function joinEvent(eventId) {
  return await postToApi("/api/events/index.php?action=join", {
    user_id: 1,
    event_id: eventId,
  });
}

export async function fetchJoined(userId) {
  return await postToApi("/api/events/index.php?action=joined", {
    user_id: userId,
  });
}
export async function fetchHistory(eventId) {
  return await postToApi("/api/events/index.php?action=history", {
    event_id: eventId,
  });
}
