import { protectRoutes } from "../commun/routeur.js";
protectRoutes();

/* --- Animation compteur --- */
function animateCount(el, target, duration = 1000) {
  const startTime = performance.now();
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const value = Math.floor(progress * target);
    el.textContent = value;
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target;
    }
  }
  requestAnimationFrame(update);
}

/* --- Badge ratio --- */
function getBadge(ratio) {
  if (ratio >= 80) return "🏆";
  if (ratio >= 50) return "🎯";
  return "👾";
}

/* --- Stats perso --- */
export function initPlayerStats() {
  const grid = document.querySelector(".stats-grid");
  if (!grid) return;

  fetch("api/core/score_user_get.php")
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        grid.innerHTML = `<p class="error">Impossible de charger les stats</p>`;
        return;
      }

      const {
        matchs_joues,
        matchs_gagnes,
        classement_general,
        classement_equipe,
      } = data;
      const ratio =
        matchs_joues > 0
          ? ((matchs_gagnes / matchs_joues) * 100).toFixed(1)
          : "0";
      const badge = getBadge(ratio);

      grid.innerHTML = `
        <div class="stats-card"><h4>Matchs joués</h4><p class="stat" data-value="${matchs_joues}">0</p></div>
        <div class="stats-card"><h4>Matchs gagnés</h4><p class="stat" data-value="${matchs_gagnes}">0</p></div>
        <div class="stats-card"><h4>Ratio de victoire</h4><p>${ratio}% ${badge}</p></div>
        <div class="stats-card"><h4>Classement général</h4><p class="stat" data-value="${classement_general}">0</p></div>
        <div class="stats-card"><h4>Classement équipe</h4><p class="stat" data-value="${classement_equipe}">0</p></div>
      `;

      for (const el of document.querySelectorAll(".stat")) {
        animateCount(el, Number.parseInt(el.dataset.value, 10)); // ✅ correction
      }
    })
    .catch((err) => {
      console.error("Erreur API stats :", err);
      grid.innerHTML = `<p class="error">Erreur de connexion au serveur</p>`;
    });
}

/* --- Classement global --- */
export function initScoreTracker() {
  const container = document.querySelector("#score-zone");
  if (!container) return;

  fetch("api/core/score_get.php")
    .then((res) => res.json())
    .then((data) => {
      if (!Array.isArray(data)) {
        container.innerHTML = `<p class="error">Impossible de charger le classement</p>`;
        return;
      }

      container.innerHTML = "";
      data.sort((a, b) => {
        const ratioA = a.matchs_joues ? a.matchs_gagnes / a.matchs_joues : 0;
        const ratioB = b.matchs_joues ? b.matchs_gagnes / b.matchs_joues : 0;
        return ratioB - ratioA;
      });

      for (const joueur of data) {
        const ratio =
          joueur.matchs_joues > 0
            ? ((joueur.matchs_gagnes / joueur.matchs_joues) * 100).toFixed(1)
            : "0";
        const badge = getBadge(ratio);

        container.insertAdjacentHTML(
          "beforeend",
          `
          <div class="score-card">
            <h4>${badge} ${joueur.nom}</h4>
            <p>Matchs joués : ${joueur.matchs_joues}</p>
            <p>Matchs gagnés : ${joueur.matchs_gagnes}</p>
            <p>Ratio de victoire : ${ratio}%</p>
          </div>
          `
        ); // ✅ parenthèse fermée correctement
      }
    })
    .catch((err) => {
      console.error("Erreur API classement :", err);
      container.innerHTML = `<p class="error">Erreur de connexion au serveur</p>`;
    });
}
