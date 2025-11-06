
import { initRoleVisibility } from './modules/roleVisibility.js';
import { initAvatarMenu } from './modules/avatarMenu.js';
import { initEventForm } from './modules/eventForm.js';
import { initEventActions } from './modules/eventActions.js';
import { initAdminTabs } from './modules/adminTabs.js';
import { initSidebar } from './modules/sidebar.js';
import { initMobileMenu } from './modules/common.js';
import { initRoleBadges } from './modules/roleBadges.js';
import { initFilDiscussion } from './modules/filDiscussion.js';
import { initIntro } from './modules/intro.js';
import { initBanner } from './modules/banner.js';
import { initCarousel } from './modules/carousel.js';
import { initContactModal } from './forms/contact.js';
import { initMultiEmailForm } from './forms/multiEmailForm.js';
import { initSignupForm } from './forms/signupForm.js';
import { initLoginForm } from './forms/loginForm.js';
import { initEventRequestForm } from './forms/eventRequestForm.js';
import { openModalAndValidate } from './forms/formDebug.js';
import { initPopupJeu } from "./modules/popupJeu.js";

document.addEventListener("DOMContentLoaded", () => {
    const role = document.body.dataset.role;
    const main = document.querySelector('main');
    const pageType = main?.classList.contains('game-page') ? 'game' : 'standard';
    const username = main?.dataset.username || "Anonyme";
    const gameId = main?.dataset.game;
    const container = document.getElementById('game-container');

    console.log("burger:", document.querySelector(".burger"));
    console.log("panel:", document.getElementById("mobile-menu"));

    // Modules communs 

    initRoleVisibility(role);
    initSidebar();
    initMobileMenu();
    initRoleBadges();
    initIntro();
    initBanner();
    initCarousel();

    initPopupJeu({
        wrapperSelector: "[data-slider-wrapper]",
        popupId: "event-popup",
        contentId: "popup-content",
        dataSource: "events.json"
    });

    //Modules formulaires initialisation une fois chargé

    // Chargement des formulaires

    (async () => {
        try {
            const res = await fetch("forms.html");
            const html = await res.text();
            document.getElementById("global-forms").innerHTML = html;

            initContactModal();
            initMultiEmailForm();
            initSignupForm();
            initLoginForm();
            initEventRequestForm();
        } catch (err) {
            console.error("Erreur de chargement des formulaires :", err);
        }
    })();



    // Modules spécifiques


    if (pageType === 'game') {
        //initialisation du chat
        const chatForm = document.getElementById('chat-form');
        if (chatForm) {
            initFilDiscussion(username);
        }
        // charger le jeu en cours
        if (gameId && container) {
            loadGame(gameId, container);
        }
    }

    if (document.querySelector('.admin-tabs')) {
        initAdminTabs();
    }

    if (document.querySelector('#avatar-name')) {
        initAvatarMenu(role);
    }

    if (document.querySelector('#event-form')) {
        initEventForm();
    }

    if (document.querySelector('.event-actions')) {
        initEventActions();
    }
    window.addEventListener('message', (event) => {
        // Vérifie que le message vient de ton domaine local
        if (event.origin !== 'http://127.0.0.1:5500') return;
        if (event.data?.type === 'chat') {
            const chatBox = document.getElementById('chat-message');
            if (chatBox) {
                const msg = document.createElement('p');
                msg.textContent = event.data.message;
                msg.classList.add('chat-system-message');
                chatBox.appendChild(msg);
                chatBox.scrollTop = chatBox.scrollHeight;
            }
        }
    });

    //  Fonction pour injecter le bon jeu

    function loadGame(gameId, container) {
        const loader = document.getElementById('game-loader');
        const titleEl = document.getElementById('game-title');

        // Dictionnaire des jeux

        const games = {
            yamzilla: {
                name: "Yamzilla",
                src: "./yamzilla/index.html"
            },
            aimtrainer: {
                name: "Aim Trainer",
                src: "./aimtrainer/index.html"
            },
            chessreflex: {
                name: "Chess Reflex",
                src: "./chessreflex/index.html"
            }
        };

        if (!games[gameId]) {
            container.innerHTML = `<p>🎮 Jeu inconnu ou non disponible.</p>`;
            if (titleEl) titleEl.textContent = "Jeu inconnu";
            return;
        }

        // 🔄 Affiche le loader

        loader?.classList.remove('hidden');
        container.innerHTML = "";

        // 📝 Met à jour le titre
        if (titleEl) {
            titleEl.textContent = games[gameId].name;
        }

        // ⏳ Charge l'iframe après un petit délai simulé
        setTimeout(() => {
            container.innerHTML = `
        <iframe src="${games[gameId].src}" width="100%" height="600" frameborder="0" allow="autoplay"></iframe>
    `;
            loader?.classList.add('hidden');
        }, 1000); // Tu peux ajuster le délai ou le remplacer par un vrai événement de chargement
    }
    const testButtons = document.querySelectorAll(".test-form");

    for (const btn of testButtons) {
        btn.addEventListener("click", () => {
            const targetId = btn.dataset.target;
            openModalAndValidate(targetId);
        });
    }

});