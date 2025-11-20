// modules/avatarMenu.js
export function initAvatarMenu(role) {
  const avatarBtn = document.querySelector(".avatar-toggle");
  const dropdown = document.querySelector(".dropdown-menu");
  const avatarImg = document.querySelector(".user-avatar img");
  const badge = document.querySelector(".role-badge");
  const validRoles = ["admin", "organisateur", "joueur"];
  if (!validRoles.includes(role)) {
    badge.textContent = "Rôle inconnu";
    badge.classList.add("role-badge");
    return;
  }

  if (avatarBtn && dropdown && avatarImg && badge) {
    avatarImg.src = "./assets/img/icones/Avatar.png";
    badge.textContent = role;
    console.log("Ajout de la classe :", `role-${role}`);
    console.log("initAvatarMenu lancé avec rôle :", role);
    console.log("avatarBtn :", avatarBtn);
    console.log("dropdown :", dropdown);
    console.log("avatarImg :", avatarImg);
    console.log("badge :", badge);

    badge.classList.add(`role-${role}`);

    avatarBtn.addEventListener("click", () => {
      dropdown.classList.toggle("show");
      const expanded = avatarBtn.getAttribute("aria-expanded") === "true";
      avatarBtn.setAttribute("aria-expanded", (!expanded).toString());
    });
  }
}
