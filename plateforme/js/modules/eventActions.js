// modules/eventActions.js
export function initEventActions() {
    console.log("initEventActions lancé");

    document.querySelectorAll('.event-card-favorite').forEach(card => {
        console.log("Carte trouvée :", card);

        const startTime = new Date(card.dataset.start);
        const now = new Date();
        const diff = startTime - now;

        const joinBtn = card.querySelector('.join-btn');
        const startBtn = card.querySelector('.start-btn');

        if (joinBtn && now >= startTime) {
            joinBtn.classList.remove('hidden');
            console.log("join-btn affiché");
        }

        if (startBtn && diff <= 1800000 && diff > 0) {
            startBtn.classList.remove('hidden');
            console.log("start-btn affiché");
        }
    });
}
