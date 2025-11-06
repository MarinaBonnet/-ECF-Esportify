export function initContactModal() {
    const contactLinks = document.querySelectorAll('a[href="contact.html"], a[href="#contacts"]');
    const modal = document.getElementById("contact-modal");
    const form = document.getElementById("contact-form");
    const closeBtn = modal?.querySelector(".close-contact");
    const feedback = modal?.querySelector(".form-feedback");

    if (!modal || !form || !closeBtn || contactLinks.length === 0) return;

    // Ouvrir le formulaire
    for (const link of contactLinks) {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            feedback?.classList.add("hidden");
            form.reset();
            modal.showModal();
        });
    }

    // Fermer le formulaire
    closeBtn.addEventListener("click", () => modal.close());
    modal.addEventListener("cancel", (e) => {
        e.preventDefault();
        modal.close();
    });

    // Soumission JS
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const nom = form.nom.value.trim();
        const email = form.email.value.trim();
        const message = form.message.value.trim();

        if (!nom || !email || !message) return;

        // Simuler l'envoi
        console.log("Message envoyé :", { nom, email, message });

        form.reset();
        feedback.classList.remove("hidden");

        setTimeout(() => {
            modal.close();
        }, 2000);
    });
}
