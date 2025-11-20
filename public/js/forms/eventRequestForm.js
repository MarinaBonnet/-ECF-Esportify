import { getUserInfo, canProposeEvents } from "../modules/permissions.js";
import { protectRoutes } from "../modules/commun/routeur.js";
protectRoutes();

export function initEventRequestForm() {
  const { id, role } = getUserInfo();
  if (!id || !canProposeEvents(role)) {
    console.warn("⛔ Tu n’as pas les droits pour proposer un événement.");
    return;
  }
  const modal = document.getElementById("event-modal");
  const form = document.getElementById("event-form");
  const closeBtn = modal?.querySelector(".close-event");
  const feedback = modal?.querySelector(".form-feedback");

  if (!modal || !form || !closeBtn) return;

  // Ouvrir modal (à adapter selon le trigger)
  function addClickListeners(selector, handler) {
    const elements = document.querySelectorAll(selector);
    for (const el of elements) {
      el.addEventListener("click", handler);
    }
  }

  addClickListeners('a[href="#event"]', (e) => {
    e.preventDefault();
    feedback?.classList.add("hidden");
    form.reset();
    modal.showModal();
  });

  // Fermer modal
  closeBtn.addEventListener("click", () => modal.close());
  modal.addEventListener("cancel", (e) => {
    e.preventDefault();
    modal.close();
  });

  // Soumission
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = form["event-name"].value.trim();
    const game = form.game.value.trim();
    const date = form.date.value;
    const desc = form.description.value.trim();
    const email = form["organizer-email"].value.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!name || !game || !date || !desc || !emailRegex.test(email)) {
      alert("Remplis tous les champs correctement.");
      return;
    }

    const payload = { name, game, date, description: desc, email };

    fetch("api/core/event_request.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          feedback.textContent = "Demande envoyée avec succès !";
          feedback.classList.remove("hidden");
          form.reset();
          setTimeout(() => modal.close(), 2000);
        } else {
          feedback.textContent =
            "Erreur : " + (result.error || "Échec de l’envoi");
          feedback.classList.remove("hidden");
        }
      })
      .catch(() => {
        feedback.textContent = "Erreur réseau ou serveur.";
        feedback.classList.remove("hidden");
      });
  });
}
