function getCounts(diceValues) {
    const counts = {};
    for (const val of diceValues) {
        counts[val] = (counts[val] || 0) + 1;
    }
    return counts;
}

function hasNOfAKind(counts, n) {
    return Object.values(counts).some(count => count >= n);
}

function isFullHouse(counts) {
    const values = Object.values(counts);
    return values.includes(3) && values.includes(2);
}

function hasStraight(diceValues, length) {
    const unique = [...new Set(diceValues)].sort((a, b) => a - b);
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
export function calculatePoints(combo, diceValues) {
    const counts = getCounts(diceValues);
    const total = diceValues.reduce((a, b) => a + b, 0);

    const comboCalculators = {
        one: () => counts[1] ? counts[1] * 1 : 0,
        two: () => counts[2] ? counts[2] * 2 : 0,
        three: () => counts[3] ? counts[3] * 3 : 0,
        four: () => counts[4] ? counts[4] * 4 : 0,
        five: () => counts[5] ? counts[5] * 5 : 0,
        six: () => counts[6] ? counts[6] * 6 : 0,
        brelan: () => hasNOfAKind(counts, 3) ? total : 0,
        carre: () => hasNOfAKind(counts, 4) ? total : 0,
        full: () => isFullHouse(counts) ? 25 : 0,
        suiteSmall: () => hasStraight(diceValues, 4) ? 30 : 0,
        suite: () => hasStraight(diceValues, 5) ? 40 : 0,
        yam: () => hasNOfAKind(counts, 5) ? 50 : 0,
        chance: () => total
    };

    return comboCalculators[combo]?.() ?? 0;
}

