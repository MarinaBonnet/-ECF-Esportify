// matchData.js recupere les tournois  depuis l'api backend

let matches = []; // cache local

/**
 * Récupère les matchs depuis l'API backend
 * @returns {Promise<Array>} - tableau de matchs
 */
export async function fetchMatches() {
  try {
    const response = await fetch("/api/matches"); // 🔹 ton endpoint backend
    if (!response.ok) throw new Error("Erreur API matches");

    matches = await response.json(); // suppose que l’API renvoie un JSON [{id,title,...}]
    return matches;
  } catch (err) {
    console.error("Impossible de charger les matchs :", err);
    return [];
  }
}

/**
 * Retourne les matchs déjà chargés (cache)
 */
export function getMatches() {
  return matches;
}
