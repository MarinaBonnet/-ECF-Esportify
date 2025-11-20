// ─── Imports ────────────────────────────────────────────────────────────────
import { safeParseInt, getScore, getScoreTest } from './utils.js';
import { calculatePoints } from './logicScore.js';
import { runAllTests } from './test-utils.js';

// ─── Constantes ─────────────────────────────────────────────────────────────
const DEBUG_MODE_LOCAL = location.hostname === "127.0.0.1";
const DEBUG_MODE = true;

// ─── Tests unitaires locaux ─────────────────────────────────────────────────
function runTests() {
    console.group("🧪 Tests unitaires pour utils.js");

    // safeParseInt
    console.assert(safeParseInt("42") === 42, "✅ safeParseInt('42') → 42");
    console.assert(safeParseInt("abc") === 0, "✅ safeParseInt('abc') → 0");
    console.assert(safeParseInt("") === 0, "✅ safeParseInt('') → 0");
    console.assert(safeParseInt(null) === 0, "✅ safeParseInt(null) → 0");
    console.assert(safeParseInt(undefined) === 0, "✅ safeParseInt(undefined) → 0");

    // getScore avec cellule DOM simulée
    const testCell = document.createElement("td");
    testCell.classList.add("score-cell");
    testCell.dataset.combo = "full";
    testCell.dataset.player = "1";
    testCell.dataset.test = "true"; // ← clé pour l’isoler
    testCell.textContent = "25";
    document.body.appendChild(testCell);


    console.log("Score retourné :", getScoreTest("full", 1, true));

    console.assert(getScoreTest("full", 1, true) === 25, "✅ getScoreTest('full', 1) → 25");
    testCell.textContent = "abc";
    console.assert(getScoreTest("full", 1, true) === 0, "✅ getScoreTest('full', 1) texte invalide → 0");

    testCell.remove();
    console.groupEnd();
}

// ─── Générateur de dés aléatoires ───────────────────────────────────────────
function getRandomDiceValues() {
    return Array.from({ length: 5 }, () => Math.floor(Math.random() * 6) + 1);
}

// ─── Mise à jour du panneau debug ───────────────────────────────────────────
export function updateDebugPanel(diceValues, combo, score) {
    if (!DEBUG_MODE) return;

    const panel = document.getElementById("debug-panel");
    if (!panel) return;

    panel.style.display = "block";

    const counts = {};
    for (const val of diceValues) {
        counts[val] = (counts[val] || 0) + 1;
    }

    document.getElementById("debug-dice").textContent = ` Dés: [${diceValues.join(", ")}]`;
    document.getElementById("debug-counts").textContent = ` Counts: ${JSON.stringify(counts)}`;
    document.getElementById("debug-combo").textContent = ` Combo: ${combo}`;
    document.getElementById("debug-score").textContent = ` Score calculé: ${score}`;
}

// ─── Simulation manuelle via bouton ─────────────────────────────────────────
function handleSimulation() {
    const comboSelect = document.getElementById("combo-select");
    if (!comboSelect) return;

    const combo = comboSelect.value;
    const diceValues = getRandomDiceValues();
    const score = calculatePoints(combo, diceValues);

    updateDebugPanel(diceValues, combo, score);
}

// ─── Initialisation globale ────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    if (DEBUG_MODE) {
        runTests();         // Tests locaux
        runAllTests();      // Tests visuels via test-utils.js

        const btn = document.getElementById("simulate-dice");
        if (btn) btn.addEventListener("click", handleSimulation);

        const testBtn = document.getElementById("run-tests");
        if (testBtn) testBtn.addEventListener("click", runAllTests);
    }
});
