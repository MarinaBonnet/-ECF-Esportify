// modules/organizerTools.js

export async function initOrganizerTools() {
  await initOrganizerInscriptions();
  await initOrganizerEvents();
}

/* ------------------ INSCRIPTIONS ------------------ */
async function initOrganizerInscriptions() {
  const tbody = document.getElementById("inscription-rows");
  tbody.innerHTML = "";

  try {
    const res = await fetch("/api/organizer/inscriptions.php");
    const inscriptions = await res.json();

    for (const insc of inscriptions) {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${insc.joueur}</td>
        <td>${insc.event}</td>
        <td>
          <button class="accept-btn" data-id="${insc.id}">Valider</button>
          <button class="reject-btn" data-id="${insc.id}">Rejeter</button>
        </td>
      `;
      tbody.appendChild(tr);
    }

    const acceptBtns = tbody.querySelectorAll(".accept-btn");
    for (const btn of acceptBtns) {
      btn.addEventListener("click", async () => {
        const ok = await updateInscription(btn.dataset.id, "valide");
        if (ok) {
          btn.textContent = "Validé ✅";
          btn.disabled = true;
          btn.closest("tr").style.background = "#d1fae5";
          showSuccess("Inscription validée !");
        }
      });
    }

    const rejectBtns = tbody.querySelectorAll(".reject-btn");
    for (const btn of rejectBtns) {
      btn.addEventListener("click", async () => {
        const ok = await updateInscription(btn.dataset.id, "rejete");
        if (ok) {
          btn.textContent = "Rejeté ❌";
          btn.disabled = true;
          btn.closest("tr").style.background = "#fee2e2";
          showError("Inscription rejetée !");
        }
      });
    }
  } catch (err) {
    showError("⚠️ Erreur chargement inscriptions");
    console.error(err);
  }
}

async function updateInscription(id, status) {
  try {
    const res = await fetch("/api/organizer/updateInscription.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inscription_id: id, status }),
    });
    if (!res.ok) {
      const errData = await res.json();
      showError(`❌ Erreur : ${errData.error}`);
      return false;
    }
    return true;
  } catch (err) {
    showError("⚠️ Erreur chargement inscriptions");
    console.error(err);
    throw err;
  }
}

/* ------------------ ÉVÉNEMENTS ------------------ */
async function initOrganizerEvents() {
  const tbody = document.getElementById("event-rows");
  const form = document.getElementById("event-form-organizer");
  tbody.innerHTML = "";

  try {
    const res = await fetch("/api/organizer/events.php");
    const events = await res.json();

    for (const ev of events) {
      const startTime = new Date(ev.start);
      const now = new Date();
      const diffMinutes = (startTime - now) / (1000 * 60);

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${ev.title}</td>
        <td>${ev.start}</td>
        <td>${ev.status}</td>
        <td>
          <button class="edit-btn" data-id="${ev.id}">Modifier</button>
          <button class="start-btn" data-id="${ev.id}" 
            ${ev.status !== "en_attente" || diffMinutes > 30 ? "disabled" : ""}>
            Démarrer
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    }

    const editBtns = tbody.querySelectorAll(".edit-btn");
    for (const btn of editBtns) {
      btn.addEventListener("click", () => {
        const ev = events.find((e) => e.id == btn.dataset.id);
        if (ev) {
          form.querySelector("[name=id]").value = ev.id;
          form.querySelector("[name=title]").value = ev.title;
          form.querySelector("[name=start]").value = ev.start.replace(" ", "T");
          form.querySelector("[name=description]").value = ev.description;
        }
      });
    }

    const startBtns = tbody.querySelectorAll(".start-btn");
    for (const btn of startBtns) {
      btn.addEventListener("click", async () => {
        const ok = await updateEventStatus(btn.dataset.id, "demarre");
        if (ok) {
          btn.textContent = "Démarré 🚀";
          btn.disabled = true;
          btn.closest("tr").style.background = "#d1fae5";
          showSuccess("Événement démarré !");
        }
      });
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const payload = Object.fromEntries(formData.entries());

      const res = await fetch("/api/organizer/events.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        showError(`❌ Erreur : ${errData.error}`);
        return;
      }

      const data = await res.json();
      showSuccess(`✅ Événement enregistré : ${data.title}`);
      form.reset();
      initOrganizerEvents(); // recharger tableau
    });
  } catch (err) {
    showError("⚠️ Erreur chargement événements");
    console.error(err);
  }
}

async function updateEventStatus(id, status) {
  try {
    const res = await fetch("/api/organizer/updateEvent.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event_id: id, status }),
    });
    if (!res.ok) {
      const errData = await res.json();
      showError(`❌ Erreur : ${errData.error}`);
      return false;
    }
    return true;
  } catch (err) {
    showError("❌ Erreur réseau");
    console.error(err);
    throw err; // ✅ relancer
  }
}

/* ------------------ ALERTES ------------------ */
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
