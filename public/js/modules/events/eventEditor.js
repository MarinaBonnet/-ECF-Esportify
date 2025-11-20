import { initEventModeration } from "./eventModeration.js";
import { getUserInfo } from "../permissions.js";

export function openEditModal(ev) {
  const { id } = getUserInfo();
  if (!id) {
    alert("🔒 Connecte-toi pour modifier un événement");
    return;
  }
  const modal = document.getElementById("edit-modal");
  const form = document.getElementById("edit-form");
  const closeBtn = document.getElementById("close-edit");

  if (!modal || !form || !closeBtn) return;

  // Pré-remplissage
  form.id.value = ev.id || "";
  form.nom.value = ev.nom || "";
  form.jeu.value = ev.jeu || "";
  form.date.value = formatDateForInput(ev.date);
  form.description.value = ev.description || "";

  // Affichage du modal
  modal.classList.remove("hidden");

  // Fermeture animée
  closeBtn.onclick = () => closeModal(modal);

  // Soumission
  form.onsubmit = (e) => {
    e.preventDefault();

    const payload = {
      id: form.id.value,
      nom: form.nom.value,
      jeu: form.jeu.value,
      date: form.date.value,
      description: form.description.value,
    };

    fetch("api/core/EventManager.php?action=update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          modal.classList.add("hidden");
          alert("✅ Événement modifié ! Il repasse en attente de validation.");
          initEventModeration(document.body.dataset.role);
        }
      });
  };
}

function closeModal(modal) {
  modal.classList.add("fade-out");
  setTimeout(() => {
    modal.classList.add("hidden");
    modal.classList.remove("fade-out");
  }, 300);
}

function formatDateForInput(dateStr) {
  const d = new Date(dateStr);
  return d.toISOString().slice(0, 10); // format YYYY-MM-DD
}
