// turn.js
import { resetTurn, getGameState } from './game.js';
import { updatePlayerUI } from './ui.js';
import { comboLabel } from './labels.js';


export function switchPlayer(currentPlayer) {
    const nextPlayer = currentPlayer === 1 ? 2 : 1;
    resetTurn();
    updatePlayerUI(nextPlayer, getGameState().maxRolls);
    return nextPlayer;
}

