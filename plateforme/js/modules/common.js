// modules/common.js
console.log("initMobileMenu lancé !");

export function initMobileMenu() {
    const siteContent = document.querySelector('.site-content');
    siteContent?.classList.add('visible');

    const burger = document.querySelector(".burger");
    const panel = document.getElementById("mobile-menu");

    if (!burger || !panel) return;

    const closeBtn = panel.querySelector(".close-menu");
    if (!closeBtn) return;

    closeBtn.addEventListener("click", closeMenu);
    burger.addEventListener("click", toggleMenu);

    panel.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", closeMenu);
    });

    panel.addEventListener("cancel", (e) => {
        e.preventDefault();
        closeMenu();
    });

    function openMenu() {
        burger.setAttribute("aria-expanded", "true");
        burger.setAttribute("aria-label", "Fermer le menu");
        if (typeof panel.showModal === "function") {
            panel.showModal();
        } else {
            panel.setAttribute("open", "");
        }
        const firstLink = panel.querySelector("a");
        if (firstLink) firstLink.focus();
    }

    function closeMenu() {
        burger.setAttribute("aria-expanded", "false");
        burger.setAttribute("aria-label", "Ouvrir le menu");
        if (typeof panel.close === "function") {
            panel.close();
        } else {
            panel.removeAttribute("open");
        }
    }

    function toggleMenu() {
        const isOpen = burger.getAttribute("aria-expanded") === "true";
        isOpen ? closeMenu() : openMenu();
    }
}
