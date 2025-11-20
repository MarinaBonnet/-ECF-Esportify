import { comboLabel } from './labels.js';
import { PART1_COMBOS, PART2_COMBOS } from './constants.js';



export const joueurs = {
    1: { nom: "Marina", avatar: "./assets/image_manga.jpg" },
    2: { nom: "BotZilla", avatar: "./assets/logo.png" }
};

/**
 * Met à jour l'affichage du joueur actif : avatar, nom, visibilité
 * @param {number} currentPlayer - Numéro du joueur actif
 * @param {number} maxRolls - Nombre de lancers restants
 */
export function updatePlayerUI(currentPlayer, maxRolls) {
    const infos = document.querySelectorAll(".player-info");
    const joueur = joueurs[currentPlayer];

    if (!joueur) {
        console.warn(`⚠️ Joueur ${currentPlayer} introuvable dans la map 'joueurs'`);
        return;
    }

    for (const info of infos) {
        const isActive = Number(info.dataset.player) === currentPlayer;
        info.classList.toggle("active", isActive);

        if (isActive) {
            const avatar = info.querySelector(".avatar");
            const label = info.querySelector(".player-label");

            if (avatar) {
                avatar.src = joueur.avatar || "./assets/default.png";
                avatar.alt = `Avatar de ${joueur.nom}`;
                console.log(`✅ Avatar mis à jour pour ${joueur.nom} → ${avatar.src}`);
            } else {
                console.warn("⚠️ Élément .avatar introuvable dans .player-info");
            }

            if (label) {
                label.textContent = `Tour de ${joueur.nom}`;
            }
        }
    }

    const counter = document.querySelector(".roll-counter");
    if (counter) counter.textContent = `Lancers restants : ${maxRolls}`;
}

/**
 * Génère dynamiquement la liste des combos pour chaque joueur
 */
export function generateComboList() {
    const combos = [...PART1_COMBOS, ...PART2_COMBOS];

    for (let player = 1; player <= 2; player++) {
        const list = document.querySelector(`.combo-list[data-player="${player}"]`);
        if (!list) continue;

        list.innerHTML = ""; // Nettoyer la liste existante

        for (const combo of combos) {
            const item = document.createElement("li");
            item.dataset.combo = combo;
            item.textContent = comboLabel(combo);
            list.appendChild(item);
        }
    }
}

/**
 * Génère la grille de score avec les combos et les cellules pour chaque joueur
 */
export function generateScoreGrid() {
    const combos = [
        "one", "two", "three", "four", "five", "six",
        "brelan", "carre", "full", "suite", "suiteSmall", "yam", "chance"
    ];

    const tbody = document.querySelector(".score-body");
    if (!tbody) return;
    tbody.innerHTML = ""; // Nettoyer le corps du tableau existant

    for (const combo of combos) {
        const row = document.createElement("tr");

        const labelCell = document.createElement("td");
        labelCell.textContent = comboLabel(combo);
        row.appendChild(labelCell);

        for (let player = 1; player <= 2; player++) {
            const scoreCell = document.createElement("td");
            scoreCell.classList.add("score-cell");
            scoreCell.dataset.combo = combo;
            scoreCell.dataset.player = player;
            row.appendChild(scoreCell);
        }

        tbody.appendChild(row);
    }
}

/**
 * Met à jour l'affichage des combos disponibles pour le joueur actif
 * @param {number} player - Numéro du joueur actif
 * @param {Object} playedCombos - Map des combos déjà joués par joueur
 */

export function updateComboUI(player, playedCombos) {

    //  Masquer tous les blocs combo sauf celui du joueur actif

    const comboGrids = document.querySelectorAll(".combo-grid");
    for (const grid of comboGrids) {
        const isActive = Number(grid.dataset.player) === player;
        grid.classList.toggle("active", isActive);

        //  Mettre à jour les combos joués 

        if (isActive) {
            const items = grid.querySelectorAll("li");
            for (const item of items) {
                const combo = item.dataset.combo;
                const isPlayed = playedCombos[player]?.has(combo);
                item.classList.toggle("locked", isPlayed);
                item.style.pointerEvents = isPlayed ? "none" : "auto";
            }
        }
    }
}


export function highlightActiveScoreColumn(player) {
    const allCells = document.querySelectorAll(".score-cell");
    for (const cell of allCells) {
        cell.classList.remove("active-player");
    }

    const activeCells = document.querySelectorAll(`.score-cell[data-player="${player}"]`);
    for (const cell of activeCells) {
        cell.classList.add("active-player");
    }
}


