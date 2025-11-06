// ─── Imports principaux ─────────────────────────────────────────────────────
import { rollDice } from './game.js';
import { toggleSound, updateSoundUI } from './config.js';
import { initializeGame } from './init.js';
import setupComboClickHandlers from './events.js';
import { updatePlayerUI, updateComboUI } from './ui.js';
import { switchPlayer } from './turn.js';

// ─── Initialisation globale ─────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    console.log("🚀 YamZilla initialisé");

    // ── Références d’état ─────────────────────────────────────────────────────
    const currentPlayerRef = { value: 1 };
    const playedCombos = {
        1: new Set(),
        2: new Set()
    };

    // ── Initialisation du jeu ─────────────────────────────────────────────────
    initializeGame(currentPlayerRef.value, playedCombos);
    setupComboClickHandlers(currentPlayerRef, playedCombos);

    // ── Mise à jour de l’interface joueur ─────────────────────────────────────
    updatePlayerUI(currentPlayerRef.value, 3); // 3 = lancers initiaux
    updateComboUI(currentPlayerRef.value, playedCombos);

    // ── Initialisation du son ─────────────────────────────────────────────────
    const soundToggle = document.querySelector(".sound-toggle");
    if (soundToggle) {
        soundToggle.addEventListener("click", toggleSound);
        updateSoundUI();
    } else {
        console.warn("⚠️ Élément .sound-toggle introuvable");
    }

    // ── Bouton de lancer de dés ───────────────────────────────────────────────
    const rollButton = document.querySelector(".roll-btn");
    if (rollButton) {
        rollButton.addEventListener("click", rollDice);
    } else {
        console.warn("⚠️ Bouton .roll-btn introuvable");
    }
});
