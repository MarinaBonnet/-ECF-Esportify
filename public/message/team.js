const teamId = "team123";

async function refreshMessages() {
  const res = await fetch(`/teams/${teamId}/messages`);
  const msgs = await res.json();
  document.getElementById("team-messages").innerHTML = msgs
    .map((m) => {
      const isMe = m.author === "Marina";
      return `
      <div class="message ${isMe ? "me" : "other"}">
        <span class="author">${m.author}</span>
        <span class="content">${m.content}</span>
        <span class="timestamp">${new Date(m.timestamp).toLocaleString()}</span>
      </div>
    `;
    })
    .join("");
}

await refreshMessages();
setInterval(refreshMessages, 5000);

document
  .getElementById("team-message-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const author = document.getElementById("author").value;
    const content = document.getElementById("content").value;

    await fetch(`/teams/${teamId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ author, content }),
    });

    await refreshMessages();
    e.target.reset();
  });
