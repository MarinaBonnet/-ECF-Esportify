import {
    setScore,

    updateScore
} from './score.js';

import { playSound } from './config.js';
import { safeParseInt, getScore } from './utils.js';
import { switchPlayer } from './turn.js';
import {
    updateComboUI,
    highlightActiveScoreColumn
} from './ui.js';
import { calculatePoints } from './logicScore.js';
import { comboLabel } from './labels.js';
import { updateDebugPanel } from './debug.js';

/**
 * Initialise les gestionnaires de clic pour les combos
 * 
 * @param {Object} currentPlayerRef - Référence au joueur actif
 * @param {Object} playedCombos - Map des combos joués par joueur
 */
export default function setupComboClickHandlers(currentPlayerRef, playedCombos) {
    for (const list of document.querySelectorAll(".combo-list")) {
        list.addEventListener("click", e => {
            const item = e.target;
            const combo = item.dataset.combo;
            const currentPlayer = currentPlayerRef.value;

            // Vérifie que la combo est valide et non déjà jouée
            if (!combo || playedCombos[currentPlayer].has(combo)) return;

            // Récupère les valeurs des dés
            const diceValues = Array.from(document.querySelectorAll(".die"))
                .map(d => safeParseInt(d.dataset.value));

            // Calcule les points pour la combinaison
            const points = calculatePoints(combo, diceValues);
            updateDebugPanel(diceValues, combo, points);

            // Enregistre le score dans la cellule correspondante
            const success = setScore(currentPlayer, combo, points);
            if (!success) return;

            // Marque la combinaison comme jouée
            playedCombos[currentPlayer].add(combo);

            // Met à jour toute la feuille de score
            updateScore(currentPlayer, playedCombos);

            // Met en avant la colonne du joueur actif
            highlightActiveScoreColumn(currentPlayer);

            // Joue le son de validation
            playSound("combo-validée");

            // Passe au joueur suivant
            currentPlayerRef.value = switchPlayer(currentPlayer);

            // Met à jour l’interface combo pour le nouveau joueur
            updateComboUI(currentPlayerRef.value, playedCombos);
        });
    }
}
