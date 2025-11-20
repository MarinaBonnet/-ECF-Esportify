// profile/profildata.js

export async function fetchStats(username) {
  // À remplacer par un appel API plus tard
  return [
    { label: "Matchs joués", value: 12 },
    { label: "Matchs gagnés", value: 7 },
    { label: "Classement général", value: 42 },
    { label: "Classement équipe", value: 5 },
  ];
}

export async function fetchFavorites(username) {
  // À remplacer par un appel API plus tard
  return [
    {
      id: 101,
      nom: "Tournoi Rocket League",
      url: "https://esportify.com/rl",
      categorie: "Outil",
    },
    {
      id: 102,
      nom: "Assistant de draft",
      url: "https://esportify.com/draft",
      categorie: "Assistant",
    },
  ];
}

export async function fetchHistory(username) {
  // À remplacer par un appel API plus tard
  return [
    {
      id: 201,
      nom: "Match Valorant",
      date: "2025-11-10",
      description: "Partie classée avec l’équipe.",
    },
    {
      id: 202,
      nom: "Tournoi FIFA",
      date: "2025-11-05",
      description: "Phase de poules terminée.",
    },
  ];
}
export async function fetchStats(username) {
  const res = await fetch(
    `api/core/ProfileFetcher.php?action=stats&username=${username}`
  );
  const data = await res.json();
  return data.stats || [];
}

export async function fetchFavorites(username) {
  const res = await fetch(
    `api/core/ProfileFetcher.php?action=favorites&username=${username}`
  );
  const data = await res.json();
  return data.favorites || [];
}

export async function fetchHistory(username) {
  const res = await fetch(
    `api/core/ProfileFetcher.php?action=history&username=${username}`
  );
  const data = await res.json();
  return data.history || [];
}
