import { getUserInfo } from "../permissions.js";

export function initEventForm() {
  const { id } = getUserInfo();
  if (!id) {
    alert("📝 Connecte-toi pour proposer un événement");
    document.getElementById("event-form")?.remove(); // ou modal.close()
    return;
  }

  const form = document.querySelector("#event-form");
  const modal = document.getElementById("event-modal");
  const cancelBtn = form.querySelector(".cancel-btn");

  if (!form || !modal || !cancelBtn) return;

  cancelBtn.addEventListener("click", () => {
    form.reset();
    form.querySelector('[name="id"]').value = "";
    form.querySelector("h2").textContent = "Proposer un événement";
    form.querySelector(".btn-label").textContent = "Envoyer la demande";
    modal.close();
  });

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const requiredFields = ["name", "game", "date", "description", "email"];
    let hasError = false;
    let formData = {};

    for (const field of requiredFields) {
      const input = form.querySelector(`[name="${field}"]`);
      const value = input?.value.trim();

      if (value) {
        input.classList.remove("error");
        formData[field] = value;
        continue;
      }

      input?.classList.add("error");
      hasError = true;
    }

    // Si l'événement est en édition, on récupère l'id
    const idInput = form.querySelector('[name="id"]');
    const idValue = idInput?.value.trim();
    if (idValue !== "") {
      formData.id = idValue;
    }

    if (hasError) {
      afficherMessage(
        "Veuillez remplir tous les champs obligatoires.",
        "error"
      );
      return;
    }

    try {
      const action = formData.id ? "update" : "create";

      const response = await fetch(
        `api/core/EventManager.php?action=${action}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      if (result.success) {
        const action = formData.id ? "modifié" : "proposé";
        afficherMessage(`✅ Événement ${action} avec succès !`, "success");
        form.reset();
      } else {
        afficherMessage(
          `❌ Erreur : ${result.error || "Échec de l’envoi."}`,
          "error"
        );
      }
    } catch (err) {
      console.error("Erreur réseau :", err);
      afficherMessage("❌ Erreur réseau. Veuillez réessayer.", "error");
    }
  });
}

function afficherMessage(texte, type) {
  const message = document.querySelector("#form-message");
  if (!message) return;

  message.textContent = texte;
  message.className = `form-feedback ${type}`;
  message.classList.remove("hidden");

  setTimeout(() => {
    message.classList.add("hidden");
    message.textContent = "";
  }, 3000);
}
