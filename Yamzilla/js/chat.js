import { setupEmojiPicker } from './emojiPicker.js';

let unreadCount = 0;

const getRandomColor = () => {
    const colors = ["#e74c3c", "#3498db", "#2ecc71", "#f39c12", "#9b59b6", "#1abc9c", "#e67e22"];
    return colors[Math.floor(Math.random() * colors.length)];
};

const playerColors = {
    1: getRandomColor(),
    2: getRandomColor()
};

const formatMessage = msg =>
    msg.replaceAll(/bravo/gi, "👏")
        .replaceAll(/lol/gi, "😂")
        .replaceAll(/chat/gi, "🐱")
        .replaceAll(/yes/gi, "✅")
        .replaceAll(/no/gi, "❌")
        .replaceAll(/yamzilla/gi, "🐉🎲");

const createBubble = (message, color) => {
    const bubble = document.createElement("div");
    bubble.classList.add("chat-bubble");
    bubble.style.color = color;
    bubble.textContent = `👤 ${formatMessage(message)}`;
    return bubble;
};

export const setupChat = currentPlayerRef => {
    const panel = document.querySelector(".chat-panel");
    const toggleBtn = document.querySelector(".chat-toggle");
    const log = panel.querySelector(".chat-log");
    const form = panel.querySelector(".chat-controls");
    const input = form.querySelector(".chat-input");

    // Toggle chat panel
    toggleBtn.addEventListener("click", () => {
        panel.classList.toggle("hidden");
        // si panneau ouvert > reset compteur
        if (!panel.classList.contains("hidden")) {
            unreadCount = 0;
            toggleBtn.textContent = "💬 Chat";
        }
    });

    // Handle message submit
    form.addEventListener("submit", e => {
        e.preventDefault();
        const message = input.value.trim();
        if (message) {
            const bubble = createBubble(message, playerColors[currentPlayerRef.value]);
            log.appendChild(bubble);
            input.value = "";
            log.scrollTop = log.scrollHeight;
            playPingSound();
            if (panel.classList.contains("hidden")) {
                unreadCount++;
                toggleBtn.classList.add("ping");
                toggleBtn.textContent = `💬 Chat (${unreadCount})`;
                setTimeout(() => toggleBtn.classList.remove("ping"), 600);
            }

        }
    });

    // Setup emoji picker
    setupEmojiPicker(panel, input);
};
// son pour messages chat
const playPingSound = () => {
    const audio = new Audio('./assets/sounds/message-ping.mp3');
    audio.volume = 0.3;
    audio.play();
};
