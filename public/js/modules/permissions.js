export function canViewEvents(role) {
  return ["joueur", "organisateur", "admin"].includes(role);
}

export function canProposeEvents(role) {
  return ["organisateur", "admin"].includes(role);
}

export function canEdit(role) {
  return ["organisateur", "admin"].includes(role);
}

export function canModerate(role) {
  return role === "admin";
}

export function canDelete(role) {
  return role === "admin";
}

export function isVisitor() {
  return !document.body.dataset.userId;
}

export function getUserRole() {
  return document.body.dataset.role || "visiteur";
}
export function getUserInfo() {
  return {
    id: document.body.dataset.userId || null,
    role: document.body.dataset.role || "visiteur",
  };
}
