// favoritesManager.js
// Gère les favoris + loggue les événements + affiche UI + score

async function safeApiCall(url, options = {}) {
  try {
    const res = await fetch(url, options);
    const data = await res.json();
    if (!data.success) throw new Error(data.error || "Erreur API");
    return data;
  } catch (err) {
    console.error("API error:", err.message);
    return { success: false, error: err.message };
  }
}

// 🔹 Log Event (localStorage + backend)
function logEvent({ type, cible, message }) {
  const event = { type, cible, message, timestamp: Date.now() };
  const history = JSON.parse(localStorage.getItem("eventHistory") || "[]");
  history.push(event);
  localStorage.setItem("eventHistory", JSON.stringify(history));

  fetch("/api/core/event_log.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(event),
  }).catch((err) => console.warn("Échec enregistrement distant :", err));
}

// 🔹 Favoris API
export async function getFavorites(userId) {
  const data = await safeApiCall(
    `/api/Favoris/favoris.json.php?action=get&user_id=${userId}`
  );
  return data.success ? data.favorites : [];
}

export async function addFavorite(userId, nom, url, categorie) {
  const result = await safeApiCall(`/api/Favoris/favoris.json.php?action=add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId, nom, url, categorie }),
  });
  if (result.success)
    logEvent({
      type: "add",
      cible: "favoris",
      message: `Favori ajouté: ${nom}`,
    });
  return result;
}

export async function removeFavorite(userId, eventId) {
  const result = await safeApiCall(
    `/api/Favoris/favoris.json.php?action=remove`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, id: eventId }),
    }
  );
  if (result.success)
    logEvent({
      type: "remove",
      cible: "favoris",
      message: `Favori retiré: ${eventId}`,
    });
  return result;
}

export async function updateFavorite(userId, eventId, nom, url, categorie) {
  const result = await safeApiCall(
    `/api/Favoris/favoris.json.php?action=update`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        id: eventId,
        nom,
        url,
        categorie,
      }),
    }
  );
  if (result.success)
    logEvent({
      type: "update",
      cible: "favoris",
      message: `Favori modifié: ${nom}`,
    });
  return result;
}

export async function toggleFavorite(
  userId,
  eventId,
  nom = "",
  url = "#",
  categorie = "match"
) {
  const favs = await getFavorites(userId);
  let result;
  if (favs.some((f) => f.id === eventId)) {
    result = await removeFavorite(userId, eventId);
  } else {
    result = await addFavorite(userId, nom, url, categorie);
  }
  if (result.success)
    logEvent({
      type: "toggle",
      cible: "favoris",
      message: `Favori togglé: ${eventId}`,
    });
  return result;
}

// 🔹 Score calculé depuis l’historique
export function calculateScore() {
  const history = JSON.parse(localStorage.getItem("eventHistory") || "[]");
  return history.reduce((score, e) => {
    switch (e.type) {
      case "add":
        return score + 10;
      case "remove":
        return score - 5;
      case "update":
        return score + 2;
      case "toggle":
        return score + 1;
      default:
        return score;
    }
  }, 0);
}

// 🔹 Rendu UI Favoris
export function renderFavorites(favs) {
  const container = document.querySelector("#favoris-container");
  if (!container) return;
  container.innerHTML = favs
    .map(
      (f) => `
    <div class="favoris-card">
      <h4>${f.nom}</h4>
      <a href="${f.url}" target="_blank">${f.categorie}</a>
    </div>
  `
    )
    .join("");
}

// 🔹 Rendu Score
export function renderScore() {
  const score = calculateScore();
  const el = document.querySelector("#favoris-score");
  if (el) el.textContent = score;
}
