export function protectRoutes() {
  const { userId, role } = document.body.dataset;
  const path = location.pathname;

  const protectedRoutes = {
    "/page_perso.php": ["organisateur", "admin", "joueur"],
    "/jeux.php": ["organisateur", "admin", "joueur"],
    "/dashboard.html": ["admin"],
  };

  const allowedRoles = protectedRoutes[path];
  if (!allowedRoles) return; // page publique

  if (!userId) {
    showAccessDeniedToast("🔒 Connexion requise");
    redirectAfter("/accueil.php");
    return;
  }

  if (!allowedRoles.includes(role)) {
    showAccessDeniedToast("🚫 Accès interdit");
    redirectAfter("/403.html");
  }
}

function showAccessDeniedToast(message) {
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.className = "access-toast";
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 1000);
}

function redirectAfter(url, delay = 1200) {
  setTimeout(() => {
    location.href = url;
  }, delay);
}
