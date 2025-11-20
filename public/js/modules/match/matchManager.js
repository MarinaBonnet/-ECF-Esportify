// matchManager.js
import { fetchMatches } from "./matchData.js";

// 🔹 Rejoindre un match (simple log ou API join)
export async function joinMatch(id) {
  console.log(`✅ Match ${id} rejoint`);
  // Exemple API : POST /matches.php?action=join
  await fetch("/matches.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ matchId: id, action: "join" }),
  });
}

// 🔹 S’inscrire à un tournoi
export async function subscribeMatch(id) {
  console.log(`✅ Inscription au tournoi ${id}`);
  await fetch("/matches.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ matchId: id, action: "subscribe" }),
  });
}

// 🔹 Se désinscrire
export async function unsubscribeMatch(id) {
  console.log(`❌ Désinscription du tournoi ${id}`);
  await fetch("/matches.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ matchId: id, action: "unsubscribe" }),
  });
}

// 🔹 Ajouter un joueur à un tournoi
export async function addPlayerToMatch(matchId, playerName) {
  try {
    const response = await fetch("/matches.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ matchId, player: playerName }),
    });

    const result = await response.json();
    console.log(`ℹ️ Réponse serveur :`, result.message || result.error);

    // 🔹 Mise à jour côté front (optionnel)
    const matches = await fetchMatches();
    const match = matches.find((m) => m.id === matchId);
    if (match && !match.players.includes(playerName)) {
      match.players.push(playerName);
    }
  } catch (err) {
    console.error("⚠️ Erreur ajout joueur :", err);
  }
}
