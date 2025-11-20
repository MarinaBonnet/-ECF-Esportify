// modules/popupJeu.js
export function initPopupJeu({
  wrapperSelector,
  popupId,
  contentId,
  dataSource,
}) {
  const wrapper = document.querySelector(wrapperSelector);
  const popup = document.getElementById(popupId);
  const popupContent = document.getElementById(contentId);

  let allEvents = [];

  async function loadData() {
    try {
      const res = await fetch("data/events.json");
      allEvents = await res.json();
    } catch (err) {
      console.error("Erreur de chargement des données :", err);
    }
  }

  function renderPopup(event) {
    popupContent.innerHTML = `
      <h2>${event.title}</h2>
      <p>${event.description}</p>
      <p><strong>Joueurs :</strong> ${event.players}</p>
      <p><strong>Proposé par :</strong> ${event.author}</p>
      <p><strong>Dates :</strong> ${event.startDate} → ${event.endDate}</p>
      <img src="${event.image}" alt="${event.title}" />
    `;
    popup.showModal();
  }

  async function setup() {
    await loadData();

    wrapper?.addEventListener("click", (e) => {
      const article = e.target.closest(".item-photo");
      if (!article) return;

      const eventId = Number.parseInt(article.dataset.id);
      const event = allEvents.find((ev) => ev.id === eventId);
      if (event) renderPopup(event);
    });
  }

  setup();
}
