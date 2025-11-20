// test-utils.js

import { safeParseInt, getScore, getScoreTest } from './utils.js';
import { calculatePoints } from './logicScore.js';

// ✅ Helper pour créer une cellule DOM de test
export function createTestCell(combo, player, value) {
    const cell = document.createElement("td");
    cell.classList.add("score-cell");
    cell.dataset.combo = combo;
    cell.dataset.player = player;
    cell.dataset.test = "true"; // pour éviter les conflits
    cell.textContent = value;
    document.body.appendChild(cell);
    return cell;
}

// ✅ Groupe de tests pour safeParseInt
function testSafeParseInt() {
    console.group("🔍 Tests : safeParseInt");

    // helper removed because it was unused

    console.groupEnd();
}

// ✅ Groupe de tests pour getScore
function testGetScore() {
    console.group("🔍 Tests : getScore");

    const cell = createTestCell("full", 1, "25");
    console.assert(getScoreTest("full", 1) === 25, "✅ getScoreTest('full', 1) → 25");

    cell.textContent = "abc";
    console.assert(getScoreTest("full", 1) === 0, "✅ getScoreTest('full', 1) avec texte invalide → 0");

    cell.remove();
    console.groupEnd();
}

// ✅ Groupe de tests pour calculatePoints
function testCalculatePoints() {
    console.group("🔍 Tests : calculatePoints");

    const dice = [2, 2, 2, 4, 5];
    const score = calculatePoints("brelan", dice);
    console.assert(score === 15, "✅ brelan [2,2,2,4,5] → 15");

    console.groupEnd();
}

// ✅ Fonction principale pour lancer tous les tests
export function runAllTests() {
    const panel = document.getElementById("test-panel");
    const list = document.getElementById("test-results");
    if (!panel || !list) return;

    list.innerHTML = ""; // reset
    panel.style.display = "block";

    testSafeParseInt();
    testGetScore();
    testCalculatePoints();
}
