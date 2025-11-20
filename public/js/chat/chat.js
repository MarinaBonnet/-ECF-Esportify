// 1. Sélection des éléments du DOM
const chatBox = document.getElementById("chat-box");
const form = document.getElementById("chat-form");
const userId = document.getElementById("user_id").value;
const eventId = document.querySelector(
  '#chat-form input[name="event_id"]'
).value;

// 2. Fonction pour récupérer les messages
async function getMessages(event_id) {
  const response = await fetch(
    `/api/chat/chat.json.php?action=get&event_id=${event_id}`
  );
  const data = await response.json();

  if (data.success) {
    chatBox.innerHTML = "";

    for (const msg of data.data) {
      const div = document.createElement("div");
      div.classList.add("chat-message");

      if (msg.user_id == userId) {
        div.classList.add("me");
      } else {
        div.classList.add("other");
      }

      div.innerHTML = `
        <strong>${msg.username}</strong> ${msg.contenu}
        <span class="date">${msg.date_envoi}</span>
      `;
      chatBox.appendChild(div);
    }

    // Auto-scroll vers le bas
    chatBox.scrollTop = chatBox.scrollHeight;
  }
}

// 3. Fonction pour envoyer un message
async function sendMessage(event) {
  event.preventDefault();
  const formData = new FormData(form);

  const response = await fetch("/api/chat/chat.json.php?action=send", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  if (data.success) {
    form.reset();
    getMessages(eventId); // refresh immédiat après envoi
  } else {
    alert(data.error);
  }
}

// 4. Initialisation
form.addEventListener("submit", sendMessage);

// Auto-refresh toutes les 5 secondes
setInterval(() => {
  getMessages(eventId);
}, 5000);

// Charger les messages au démarrage
globalThis.addEventListener("DOMContentLoaded", () => {
  getMessages(eventId);
});
