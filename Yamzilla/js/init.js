// init.js

import { updatePlayerUI, generateScoreGrid, updateComboUI, generateComboList, highlightActiveScoreColumn } from './ui.js';
import { getGameState } from './game.js';
import { comboLabel } from './labels.js';
import { updateScore } from './score.js';

/**
 * Initialise l'interface du jeu pour tous les joueurs
 * @param {number} currentPlayer - Le joueur actif au démarrage
 * @param {Object} playedCombos - Objet contenant les combos joués par chaque joueur
 */
export function initializeGame(currentPlayer, playedCombos,) {
    // Générer la grille de score
    generateScoreGrid();



    // Générer les combos pour chaque joueur
    generateComboList();

    // Mettre à jour l'interface du joueur actif
    updatePlayerUI(currentPlayer, getGameState().maxRolls);

    // Mettre en avant la colonne du joueur actif
    highlightActiveScoreColumn(currentPlayer);

    //  Verrouiller les combos déjà joués pour chaque joueur
    for (const player of Object.keys(playedCombos)) {
        updateComboUI(Number(player), playedCombos);
    }
    // Mettre à jour la feuille de score
    updateScore(currentPlayer, playedCombos);
}
