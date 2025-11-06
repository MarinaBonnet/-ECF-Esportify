import { comboLabel } from './labels.js';


export const userConfig = {
    soundEnabled: true,
    theme: "light", // ou "dark"
    diceStyle: "classic", // ou "manga", "minimal"
    animations: true
};

/**
 * Active ou désactive le son
 */
export function toggleSound() {
    userConfig.soundEnabled = !userConfig.soundEnabled;
    updateSoundUI();
}

/**
 * Met à jour l'interface du bouton son
 */
export function updateSoundUI() {
    const soundBtn = document.querySelector(".sound-toggle");
    if (soundBtn) {
        soundBtn.textContent = userConfig.soundEnabled ? "🔊 Son activé" : "🔇 Son coupé";
    }
}

/**
 * Joue un son si activé
 */
export function playSound(name) {
    if (!userConfig.soundEnabled) return;

    const audio = new Audio(`Yamzilla/assets/${name}.mp3`);
    audio.play().catch(err => {
        console.error("Erreur lors de la lecture du son :", err);
    });
}
