import { protectRoutes } from "../modules/permissions.js";
protectRoutes();

export function validateEvent(id, card) {
  fetch("api/core/event_validate.php", {
    method: "POST",
    body: JSON.stringify({ id }),
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        card.classList.add("validated");
        card.querySelector(".actions").innerHTML =
          '<p class="success">✅ Événement validé</p>';
      }
    });
}

export function rejectEvent(id, card) {
  fetch("api/core/event_reject.php", {
    method: "POST",
    body: JSON.stringify({ id }),
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        card.classList.add("rejected");
        card.querySelector(".actions").innerHTML =
          '<p class="error">❌ Événement refusé</p>';
      }
    });
}

export function deleteEvent(id, card) {
  if (!confirm("Supprimer cet événement ?")) return;

  fetch("api/core/event_delete.php", {
    method: "POST",
    body: JSON.stringify({ id }),
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        card.remove();
      }
    });
}
