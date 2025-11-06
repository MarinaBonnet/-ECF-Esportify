// modules/eventForm.js
export function initEventForm() {
    const forms = document.querySelectorAll('form[id^="event-form"]');
    const list = document.querySelector('.event-history .event-list');

    if (!list) {
        console.warn("event-list introuvable");
        return;
    }

    forms.forEach(form => {
        form.addEventListener('submit', e => {
            e.preventDefault();
            const title = form.title.value;
            const start = form.start.value;

            const newEvent = document.createElement('div');
            newEvent.className = 'event-card';
            newEvent.innerHTML = `
        <h4>${title}</h4>
        <p>Début : ${new Date(start).toLocaleString()}</p>
        <p><em>Statut : En attente de validation</em></p>
      `;
            list.prepend(newEvent);
            form.reset();
        });
    });
}

