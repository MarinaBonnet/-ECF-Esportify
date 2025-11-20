// modules/modal.js
export function openModalAndValidate(targetId) {
  const modal = document.getElementById(targetId);
  if (!modal) return;

  // Ouvre le modal
  modal.classList.add("open");

  // Ferme le modal si on clique sur le bouton "close"
  const closeBtn = modal.querySelector(".close-modal");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      modal.classList.remove("open");
    });
  }

  // Validation du formulaire
  const form = modal.querySelector("form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (form.checkValidity()) {
        alert("Formulaire valide ✅");
        modal.classList.remove("open");
      } else {
        alert("Veuillez remplir correctement le formulaire ⚠️");
      }
    });
  }
}
