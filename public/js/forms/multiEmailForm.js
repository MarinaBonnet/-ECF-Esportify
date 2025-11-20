export function initMultiEmailForm() {
  const form = document.getElementById("contact-form");
  const emailGroup = document.getElementById("email-group");
  const addBtn = document.getElementById("add-email");

  if (!form || !emailGroup || !addBtn) return;

  // Fonction pour créer un champ email avec bouton suppression
  let emailCount = 1;

  function createEmailField() {
    const wrapper = document.createElement("div");
    wrapper.classList.add("email-field");

    const inputId = `email-${emailCount++}`;

    const label = document.createElement("label");
    label.setAttribute("for", inputId);
    label.textContent = "Email";

    const input = document.createElement("input");
    input.type = "email";
    input.name = "email[]";
    input.id = inputId;
    input.required = true;

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.classList.add("remove-email");
    removeBtn.textContent = "×";
    removeBtn.setAttribute("aria-label", "Supprimer cet email");
    removeBtn.addEventListener("click", () => wrapper.remove());

    // Suppression avec animation
    removeBtn.addEventListener("click", () => {
      wrapper.classList.add("fade-out-left");
      wrapper.addEventListener(
        "animationend",
        () => {
          wrapper.remove();
        },
        { once: true }
      );
    });

    wrapper.appendChild(label);
    wrapper.appendChild(input);
    wrapper.appendChild(removeBtn);
    wrapper.classList.add("email-field", "fade-in");

    return wrapper;
  }

  // Ajouter un champ email
  addBtn.addEventListener("click", () => {
    const field = createEmailField();
    emailGroup.appendChild(field);
  });
  // Initialiser avec un champ si vide
  if (emailGroup.children.length === 0) {
    emailGroup.appendChild(createEmailField());
  }

  // Validation JS à la soumission
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const emails = Array.from(
      form.querySelectorAll('input[name="email[]"]')
    ).map((input) => input.value.trim());
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const allValid = emails.every((email) => emailRegex.test(email));
    if (!allValid) {
      alert("Un ou plusieurs emails sont invalides.");
      return;
    }

    console.log("Emails valides :", emails);
    alert("Message envoyé !");
    form.reset();
    emailGroup.innerHTML = ""; // Réinitialiser les champs
    emailGroup.appendChild(createEmailField()); // Recréer le champ initial
  });

  // Initialiser avec un champ
  emailGroup.innerHTML = "";
  emailGroup.appendChild(createEmailField());
}
