export function showLoader(id, message = "Chargement...") {
  const loader = document.getElementById(id);
  if (loader) {
    loader.textContent = message;
    loader.classList.remove("hidden");
  }
}

export function hideLoader(id) {
  const loader = document.getElementById(id);
  if (loader) {
    loader.classList.add("hidden");
  }
}

export function updateLoader(id, message) {
  const loader = document.getElementById(id);
  if (loader) {
    loader.textContent = message;
  }
}
