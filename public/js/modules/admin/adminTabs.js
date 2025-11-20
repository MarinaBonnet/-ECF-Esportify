// modules/adminTabs.js
export function initAdminTabs() {
  const tabs = document.querySelectorAll(".tab-btn");
  const sections = document.querySelectorAll("[data-tab-content]");

  // Boucle moderne avec for...of
  for (const btn of tabs) {
    btn.addEventListener("click", () => {
      // Désactiver tous les onglets
      for (const t of tabs) {
        t.classList.remove("active");
      }
      btn.classList.add("active");

      // Masquer toutes les sections
      for (const section of sections) {
        section.classList.add("hidden");
      }

      // Afficher la section ciblée
      const targetId = btn.dataset.tab;
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.classList.remove("hidden");
      }
    });
  }

  // Activer le premier onglet par défaut
  if (tabs.length > 0) {
    tabs[0].classList.add("active");
    const targetId = tabs[0].dataset.tab;
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      targetSection.classList.remove("hidden");
    }
  }
}
