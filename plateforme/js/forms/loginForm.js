export function initLoginForm() {
    const modal = document.getElementById("login-modal");
    const form = document.getElementById("login-form");
    const closeBtn = modal?.querySelector(".close-login");
    const feedback = modal?.querySelector(".form-feedback");

    if (!modal || !form || !closeBtn) return;

    // Trigger d'ouverture
    const loginLinks = document.querySelectorAll('a[href="#login"]');
    for (const link of loginLinks) {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            feedback?.classList.add("hidden");
            form.reset();
            modal.showModal();
        });
    }

    // Fermeture
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
        const code = form.code.value.trim();

        if (!username || !password || code !== "123456") {
            alert("Identifiants ou code incorrect.");
            return;
        }

        console.log("Connexion :", { username });
        feedback.classList.remove("hidden");
        form.reset();

        setTimeout(() => modal.close(), 2000);
    });
}
