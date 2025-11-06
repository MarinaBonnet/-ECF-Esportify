// ───  Génération de la face de dé ──────────────────────────────────────────

/**
 * Génère le HTML d'une face de dé en grille 3x3
 * @param {number} value - Valeur du dé (1 à 6)
 * @returns {string} - HTML de la face
 */
export function generateDieFace(value) {
    const positions = {
        1: [4],
        2: [0, 8],
        3: [0, 4, 8],
        4: [0, 2, 6, 8],
        5: [0, 2, 4, 6, 8],
        6: [0, 2, 3, 5, 6, 8],
    };

    return `<div class="face-grid">${Array.from({ length: 9 }, (_, i) =>
        `<span class="dot${positions[value].includes(i) ? ' active' : ''}"></span>`
    ).join('')}</div>`;
}

// ─── Analyse des dés ──────────────────────────────────────────────────────

/**
 * Calcule la fréquence de chaque valeur dans un tableau
 * @param {number[]} values - Valeurs des dés
 * @returns {Object} - Fréquence par valeur
 */
export function getCounts(values) {
    return values.reduce((acc, val) => {
        acc[val] = (acc[val] ?? 0) + 1;
        return acc;
    }, {});
}

/**
 * Vérifie s'il y a une suite de n dés consécutifs
 * @param {number[]} values - Valeurs des dés
 * @param {number} length - Longueur minimale de la suite
 * @returns {boolean}
 */
export function hasStraight(values, length) {
    const unique = [...new Set(values)].sort((a, b) => a - b);
    let streak = 1;

    for (let i = 1; i < unique.length; i++) {
        if (unique[i] === unique[i - 1] + 1) {
            streak++;
            if (streak >= length) return true;
        } else {
            streak = 1;
        }
    }

    return false;
}

// ───  Parsing sécurisé ─────────────────────────────────────────────────────

/**
 * Convertit un texte en entier, retourne 0 si invalide
 * @param {string} value
 * @returns {number}
 */
export function safeParseInt(value) {
    const parsed = Number.parseInt(value?.trim?.(), 10);
    return Number.isNaN(parsed) ? 0 : parsed;
}

// ─── Récupération de score ────────────────────────────────────────────────

/**
 * Récupère le score d'une cellule combo pour un joueur
 * @param {string} combo - Nom de la combinaison
 * @param {number} player - Numéro du joueur
 * @returns {number}
 */
export function getScore(combo, player) {
    const cell = document.querySelector(`.score-cell[data-combo="${combo}"][data-player="${player}"]`);
    return safeParseInt(cell?.textContent);
}

/**
 * Version isolée pour les tests unitaires (évite les conflits DOM)
 * @param {string} combo
 * @param {number} player
 * @returns {number}
 */
export function getScoreTest(combo, player) {
    const cell = document.querySelector(`.score-cell[data-combo="${combo}"][data-player="${player}"][data-test="true"]`);
    return safeParseInt(cell?.textContent);
}
