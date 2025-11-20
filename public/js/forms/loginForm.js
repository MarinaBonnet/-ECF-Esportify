export function initLoginForm() {
  const modal = document.getElementById("login-modal");
  const form = document.getElementById("login-form");
  const closeBtn = modal?.querySelector(".close-login");
  const feedback = modal?.querySelector(".form-feedback");

  if (!modal || !form || !closeBtn) return;

  // Trigger d'ouverture
  const loginLinks = document.querySelectorAll(
    'a[href="#login"], [aria-controls="login-modal"]'
  );
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
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = new FormData(form);

    try {
      const res = await fetch("api/forms/login.php", {
        method: "POST",
        body: data,
      });
      const json = await res.json();

      feedback.textContent = json.message;
      feedback.classList.remove("hidden");

      if (json.success) {
        form.reset();
        // Exemple : stocker l'utilisateur en sessionStorage
        sessionStorage.setItem("user", json.user);
        setTimeout(() => modal.close(), 2000);
      }
    } catch (err) {
      feedback.textContent = "❌ Erreur lors de la connexion";
      feedback.classList.remove("hidden");
      console.error(err);
    }
  });
}
