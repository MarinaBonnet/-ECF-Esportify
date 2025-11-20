// forms/index.js
import { initContactModal } from "./contact.js";
import { initEventRequestForm } from "./eventRequestForm.js";
import { initLoginForm } from "./loginForm.js";
import { initMultiEmailForm } from "./multiEmailForm.js";
import { initSignupForm } from "./signupForm.js";
import { openModalAndValidate } from "./formDebug.js";
import { showLoader, hideLoader, updateLoader } from "../modules/loader.js";

export async function initForms() {
  const loaderId = "form-loader";
  showLoader(loaderId, "Chargement des formulaires...");

  try {
    const res = await fetch("forms.html");
    const html = await res.text();
    document.getElementById("global-forms").innerHTML = html;

    // Initialisation des modules de formulaire
    initContactModal();
    initEventRequestForm();
    initLoginForm();
    initMultiEmailForm();
    initSignupForm();

    // Exposition optionnelle du debug
    globalThis.openModalAndValidate = openModalAndValidate;

    hideLoader(loaderId);
  } catch (err) {
    console.error("Erreur de chargement des formulaires :", err);
    updateLoader(loaderId, "❌ Erreur de chargement des formulaires");
    setTimeout(() => hideLoader(loaderId), 3000);
  }
}
