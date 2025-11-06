export const COMBO_LABELS = {
    one: "Une",
    two: "Deux",
    three: "Trois",
    four: "Quatre",
    five: "Cinq",
    six: "Six",
    brelan: "Brelan",
    carre: "Carré",
    full: "Full House",
    suiteSmall: "Petite Suite",
    suite: "Grande Suite",
    yam: "YamZilla",
    chance: "Chance",
    bonus: "Bonus <63"
};

export const PART1_COMBOS = ["one", "two", "three", "four", "five", "six"];
export const PART2_COMBOS = ["brelan", "carre", "full", "suiteSmall", "suite", "yam", "chance"];
export const ALL_COMBOS = [...PART1_COMBOS, ...PART2_COMBOS];

export function comboLabel(combo, fallback = "Inconnu") {
    return COMBO_LABELS[combo] || fallback;
}
