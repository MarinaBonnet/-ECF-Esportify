import { initMultiEmailForm } from '../forms/multiEmailForm.js';



export function initSignupForm() {
    const modal = document.getElementById("signup-modal");
    const form = document.getElementById("signup-form");
    const closeBtn = modal?.querySelector(".close-signup");
    const feedback = modal?.querySelector(".form-feedback");

    if (!modal || !form || !closeBtn) return;
    const passwordInput = form.password;
    const strengthBar = document.getElementById("password-strength");
    const strengthLabel = document.getElementById("strength-label");

    passwordInput.addEventListener("input", () => {
        const val = passwordInput.value;
        let score = 0;

        if (val.length >= 8) score += 25;
        if (/[A-Z]/.test(val)) score += 20;
        if (/[a-z]/.test(val)) score += 20;
        if (/\d/.test(val)) score += 20;
        if (/[^A-Za-z0-9]/.test(val)) score += 15;

        strengthBar.value = score;

        if (score < 40) {
            strengthLabel.textContent = "Force : Faible";
            strengthLabel.style.color = "red";
        } else if (score < 70) {
            strengthLabel.textContent = "Force : Moyenne";
            strengthLabel.style.color = "orange";
        } else {
            strengthLabel.textContent = "Force : Forte";
            strengthLabel.style.color = "green";
        }
    });


    initMultiEmailForm("#signup-email-group", "#signup-add-email");

    // Ouvrir modal (à adapter selon ton trigger)

    function validateMultiEmails(groupSelector) {
        const group = document.querySelector(groupSelector);
        const inputs = group.querySelectorAll('input[type="email"]');
        const emails = [];
        let valid = true;

        for (const input of inputs) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailRegex.test(email)) {
                input.classList.remove('invalid');
                emails.push(email);
            } else {
                input.classList.add('invalid');
                valid = false;
            }

        }

        return { valid, emails };
    }
    // Fermer modal
    closeBtn.addEventListener("click", () => modal.close());
    modal.addEventListener("cancel", (e) => {
        e.preventDefault();
        modal.close();
    });

    // Soumission
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const username = form.username.value.trim();
        const password = form.password.value;
        const confirm = form["confirm-password"].value;

        if (!username || !password || !confirm || password !== confirm) {
            alert("Vérifie les champs et que les mots de passe correspondent.");
            return;
        }

        showEmailErrors("#signup-email-group");
        const { valid, emails } = validateMultiEmails("#signup-email-group");
        if (!valid) return;

        console.log("Inscription :", { username, emails });
        feedback.classList.remove("hidden");
        form.reset();

        setTimeout(() => modal.close(), 2000);
    });
}
