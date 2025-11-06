
// modules/roleVisibility.js
export function initRoleVisibility(role) {
    document.querySelectorAll("[data-visible-for]").forEach(el => {
        const roles = el.dataset.visibleFor.split(',').map(r => r.trim());
        el.classList.toggle("hidden", !roles.includes(role));
    });
}
