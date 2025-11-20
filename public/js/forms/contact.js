export function initContactModal() {
  const contactLinks = document.querySelectorAll(
    'a[href="contact.html"], a[href="#contacts"], [aria-controls="contact-modal"]'
  );
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
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nom = form.nom.value.trim();
    const emails = [...form.querySelectorAll('input[name="email[]"]')]
      .map((input) => input.value.trim())
      .filter((val) => val !== "");
    const message = form.message.value.trim();

    if (!nom || emails.length === 0 || !message) return;

    // Envoi via fetch
    try {
      const data = new FormData(form);
      const res = await fetch("api/forms/contact.php", {
        method: "POST",
        body: data,
      });
      const text = await res.text();
      console.log("Réponse du serveur :", text);
    } catch (err) {
      console.error("Erreur lors de l'envoi :", err);
    }

    // Feedback visuel
    console.log("Message envoyé :", { nom, emails, message });
    form.reset();
    feedback.classList.remove("hidden");

    setTimeout(() => {
      modal.close();
    }, 2000);
  });
}
