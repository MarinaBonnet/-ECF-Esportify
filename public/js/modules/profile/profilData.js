// profile/profildata.js
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
