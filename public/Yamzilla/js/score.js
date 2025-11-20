// ─── Imports ────────────────────────────────────────────────────────────────
import { safeParseInt, getScore } from "./utils.js";

// ─── Enregistrement du score ────────────────────────────────────────────────

/**
 * Enregistre le score d’un joueur pour une combinaison donnée
 * @param {number} player
 * @param {string} combo
 * @param {number} score
 * @returns {boolean} true si le score a été enregistré, false sinon
 */
export function setScore(player, combo, score) {
    const cell = document.querySelector(`.score-cell[data-player="${player}"][data-combo="${combo}"]`);
    if (!cell || cell.textContent.trim() !== "") return false;

    cell.textContent = score;
    cell.classList.add("scored");
    return true;
}

// ─── Calculs de score ───────────────────────────────────────────────────────

/**
 * Calcule le score de la partie haute (1 à 6)
 * @param {number} player
 * @returns {number}
 */
export function getUpperSectionScore(player) {
    const upperCombos = ["one", "two", "three", "four", "five", "six"];
    let total = 0;

    for (const combo of upperCombos) {
        const score = getScore(combo, player);
        total += score;
    }

    return total;
}

/**
 * Calcule le score total du joueur, avec bonus si applicable
 * @param {number} player
 * @returns {number}
 */
export function getTotalScore(player) {
    const allCells = document.querySelectorAll(`.score-cell[data-player="${player}"]`);
    let total = 0;

    for (const cell of allCells) {
        const value = safeParseInt(cell.textContent);
        total += value;
    }

    const upperScore = getUpperSectionScore(player);
    const bonusValue = upperScore >= 63 ? 35 : 0;

    const bonusCell = document.querySelector(`.bonus-cell[data-player="${player}"]`);
    if (bonusCell) {
        bonusCell.textContent = bonusValue ? "+35 pts" : "";
    }

    return total + bonusValue;
}

// ─── Mise à jour du score affiché ───────────────────────────────────────────

/**
 * Met à jour toutes les cellules de score pour chaque joueur
 * @param {number} player
 * @param {Set<string>} playedCombos
 */
export function updateScore(player, playedCombos) {
    const allPlayers = [1, 2]; // extensible
    for (const p of allPlayers) {
        updatePlayerScore(p);
    }
}

/**
 * Met à jour les cellules de score pour un joueur donné
 * @param {number} player
 */
function updatePlayerScore(player) {
    const cells = document.querySelectorAll(`.score-cell[data-player="${player}"]`);
    for (const cell of cells) {
        const combo = cell.dataset.combo;
        const score = getScore(combo, player);
        const isEmpty = cell.textContent.trim() === "";

        cell.textContent = score === 0 && isEmpty ? "" : `${score} pts`;
    }

    const upperScore = getUpperSectionScore(player);
    const bonusValue = upperScore >= 63 ? 35 : 0;
    const totalScore = getTotalScore(player);
    const part2 = totalScore - upperScore - bonusValue;

    setTextContent(`.total-part1[data-player="${player}"]`, `${upperScore} pts`);
    setTextContent(`.bonus-cell[data-player="${player}"]`, bonusValue ? "+35 pts" : "");
    setTextContent(`.total-part2[data-player="${player}"]`, `${part2} pts`);
    setTextContent(`.total[data-player="${player}"]`, `${totalScore} pts`);
}

// ─── Utilitaire DOM ─────────────────────────────────────────────────────────

function setTextContent(selector, text) {
    const el = document.querySelector(selector);
    if (el) el.textContent = text;
}
