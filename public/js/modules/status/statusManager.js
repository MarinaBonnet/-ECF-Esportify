// statusManager.js

import { protectRoutes } from "../commun/routeur.js";
protectRoutes();

let statusList = [];

export function initStatusManager() {
  logEvent({
    type: "init",
    cible: "statusManager",
    message: "Module Status Manager initialisé",
  });

  loadStatusList();
}

// 🔹 Charge les statuts depuis le backend
async function loadStatusList() {
  try {
    const res = await fetch("/api/core/status_get.php");
    statusList = await res.json();
    renderStatusCards();
  } catch (err) {
    console.error("Erreur chargement statuts :", err);
  }
}

// 🔹 Affiche les cartes de statut
function renderStatusCards() {
  const container = document.getElementById("status-zone");
  container.innerHTML = "";

  for (const item of statusList) {
    const card = document.createElement("div");
    card.className = "status-card";

    card.innerHTML = `
      <h3>${item.nom}</h3>
      <p>Statut : <strong>${item.statut}</strong></p>
      <select data-id="${item.id}">
        <option value="actif" ${
          item.statut === "actif" ? "selected" : ""
        }>Actif</option>
        <option value="inactif" ${
          item.statut === "inactif" ? "selected" : ""
        }>Inactif</option>
        <option value="bloqué" ${
          item.statut === "bloqué" ? "selected" : ""
        }>Bloqué</option>
      </select>
    `;

    card.querySelector("select").addEventListener("change", (e) => {
      const id = e.target.dataset.id;
      const nouveauStatut = e.target.value;
      updateStatus(id, nouveauStatut);
    });

    container.appendChild(card);
  }
}

// 🔹 Met à jour le statut côté serveur
async function updateStatus(id, statut) {
  try {
    await fetch("/api/core/status_update.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, statut }),
    });

    logEvent({
      type: "modification",
      cible: "statut",
      message: `Statut de l’élément ${id} mis à jour : ${statut}`,
    });

    loadStatusList(); // recharge les cartes
  } catch (err) {
    console.error("Erreur mise à jour statut :", err);
  }
}
const createStatusCard = (module, statut) => `
  <div class="status-card" data-statut="${statut}">
    <h4>${module}</h4>
    <p>Statut : <span class="statut-text">${statut}</span></p>
    <button class="toggle-status-btn">
      <span class="spinner hidden"></span>
      Changer le statut
    </button>
  </div>
`;

const buttons = document.querySelectorAll(".toggle-status-btn");

for (const btn of buttons) {
  btn.addEventListener("click", () => {
    const card = btn.closest(".status-card");
    const module = card.querySelector("h4").textContent;
    const currentStatut = card.dataset.statut;
    const newStatut = currentStatut === "actif" ? "bloqué" : "actif";
    const spinner = btn.querySelector(".spinner");

    spinner.classList.remove("hidden");
    btn.disabled = true;

    fetch("api/core/status_update.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ module, statut: newStatut }),
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.status === "ok") {
          const iconSpan = card.querySelector("h4");
          let newIcon = "";

          if (newStatut === "actif") {
            newIcon = "✅";
          } else if (newStatut === "bloqué") {
            newIcon = "❌";
          } else {
            newIcon = "⚠️";
          }

          iconSpan.innerHTML = `${newIcon} ${module}`;

          card.dataset.statut = newStatut;
          card.querySelector(".statut-text").textContent = newStatut;

          card.classList.add("flash-success");
          setTimeout(() => card.classList.remove("flash-success"), 600);
        } else {
          card.classList.add("flash-error");
          setTimeout(() => card.classList.remove("flash-error"), 600);
        }
      })

      .finally(() => {
        spinner.classList.add("hidden");
        btn.disabled = false;
      });
  });
}
