// game.js

import { playSound } from './config.js';
import { generateDieFace } from './utils.js';
import { comboLabel } from './labels.js';
import { highlightActiveScoreColumn } from "./ui.js";




const gameState = {
    keptDice: [],
    rollCount: 0,
    maxRolls: 3
};


/**
 * Retourne l'état courant du jeu
 */
export function getGameState() {
    return gameState;
}

/**
 * Réinitialise le tour : dés, compteur, interface
 */
export function resetTurn() {
    gameState.rollCount = 0;
    gameState.keptDice = [];

    document.querySelector(".dice-container")?.replaceChildren();
    document.querySelector(".kept-container")?.replaceChildren();
    updateRollCounter();
}

/**
 * Met à jour l'affichage du nombre de lancers restants
 */
function updateRollCounter() {
    const counter = document.querySelector(".roll-counter");
    if (counter) {
        counter.textContent = `Lancers restants : ${gameState.maxRolls - gameState.rollCount}`;
    }
}

/**
 * Lance les dés non gardés et met à jour l'interface
 */
export function rollDice() {
    if (gameState.rollCount >= gameState.maxRolls) return;

    const diceContainer = document.querySelector(".dice-container");
    const keptContainer = document.querySelector(".kept-container");

    if (!diceContainer || !keptContainer) return;

    diceContainer.replaceChildren();

    const diceToRoll = 5 - gameState.keptDice.length;

    for (let i = 0; i < diceToRoll; i++) {
        const value = Math.floor(Math.random() * 6) + 1;
        const die = createDie(value);
        diceContainer.appendChild(die);
    }

    gameState.rollCount++;
    updateRollCounter();
}

/**
 * Crée un élément DOM représentant un dé interactif
 * @param {number} value - Valeur du dé (1 à 6)
 * @returns {HTMLElement}
 */
function createDie(value) {
    const die = document.createElement("div");
    die.className = "die";
    die.innerHTML = generateDieFace(value);
    die.dataset.value = value;

    die.addEventListener("click", () => {
        const isKept = die.classList.toggle("kept");

        if (isKept) {
            gameState.keptDice.push(die);
            document.querySelector(".kept-container")?.appendChild(die);
            die.classList.add("mini");
            playSound("click");
        } else {
            gameState.keptDice = gameState.keptDice.filter(d => d !== die);
            document.querySelector(".dice-container")?.appendChild(die);
            die.classList.remove("mini");
            playSound("click");
        }
    });

    return die;
}

