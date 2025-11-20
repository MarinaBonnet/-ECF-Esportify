export async function initPlayerTools() {
  await loadAvailableEvents();
  await loadMyInscriptions();
  initCreateEventForm();
}
function initCreateEventForm() {
  const form = document.getElementById("event-form-player");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/player/createEvent.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        showError(
          `❌ Erreur : ${errData.error || "Impossible de créer l'événement"}`
        );
        return;
      }

      const data = await res.json();
      showSuccess(`✅ Événement créé : ${data.title}`);
      form.reset();

      // Recharger la liste des événements disponibles
      await loadAvailableEvents();
    } catch (err) {
      showError("❌ Erreur réseau lors de la création");
      console.error(err);
    }
  });
}
async function loadAvailableEvents() {
  const tbody = document.getElementById("available-events");
  if (!tbody) return;

  // Attacher les listeners après rendu PHP
  const joinBtns = document.querySelectorAll(".join-btn");
  for (const btn of joinBtns) {
    btn.addEventListener("click", async () => {
      const eventId = btn.dataset.id;
      try {
        const res = await fetch("/api/player/join.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ event_id: eventId }),
        });

        if (!res.ok) {
          const errData = await res.json();
          showError(
            `❌ Erreur : ${errData.error || "Impossible de s'inscrire"}`
          );
          return;
        }

        const data = await res.json();
        showSuccess(`✅ Inscription envoyée pour l'événement ${data.event_id}`);
        await loadMyInscriptions(); // recharger tableau inscriptions
      } catch (err) {
        showError("❌ Erreur réseau lors de l'inscription");
        console.error(err);
      }
    });
  }
}

async function loadMyInscriptions() {
  const tbody = document.getElementById("my-inscriptions");
  if (!tbody) return;

  tbody.innerHTML = "";
  const res = await fetch("/api/player/inscriptions.php");
  const inscriptions = await res.json();

  for (const insc of inscriptions) {
    const tr = document.createElement("tr");

    // 🔹 Extraction de la logique de statut
    let statusLabel;
    if (insc.status === "valide") {
      statusLabel = "✅ Validée";
    } else if (insc.status === "rejete") {
      statusLabel = "❌ Rejetée";
    } else {
      statusLabel = "⏳ En attente";
    }

    tr.innerHTML = `
    <td>${insc.event}</td>
    <td>${insc.start}</td>
    <td>${statusLabel}</td>
  `;
    tbody.appendChild(tr);
  }
}

/* Alertes visuelles */
function showError(message) {
  const alertBox = document.createElement("div");
  alertBox.className = "alert error";
  alertBox.textContent = message;
  document.body.appendChild(alertBox);
  setTimeout(() => alertBox.remove(), 4000);
}

function showSuccess(message) {
  const alertBox = document.createElement("div");
  alertBox.className = "alert success";
  alertBox.textContent = message;
  document.body.appendChild(alertBox);
  setTimeout(() => alertBox.remove(), 4000);
}
