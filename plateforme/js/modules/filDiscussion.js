export function initFilDiscussion(username = "Marinabpro") {
    console.log("Fil de discussion initialisé");

    const form = document.getElementById('chat-form');
    const input = document.getElementById('chat-input');
    const messagesContainer = document.getElementById('chat-messages');

    if (!form || !input || !messagesContainer) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const message = input.value.trim();
        if (message) {
            const msgEl = document.createElement('div');
            msgEl.classList.add('chat-message');
            msgEl.innerHTML = `<strong>${username}</strong> : ${message}`;
            messagesContainer.appendChild(msgEl);
            input.value = '';
            input.focus();
        }
    });
}
