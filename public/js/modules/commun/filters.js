// filters.js

/**
 * Filtre une liste d'éléments par catégorie et statut
 * @param {Array} items - tableau d'objets (matchs, favoris, historiques…)
 * @param {string} category - catégorie à filtrer (vide = pas de filtre)
 * @param {string} status - statut à filtrer (vide = pas de filtre)
 * @returns {Array} - éléments filtrés
 */
export function filterByCategoryAndStatus(items, category = "", status = "") {
  return items.filter((item) => {
    const itemCategory = (item.category || "").toLowerCase();
    const itemStatus = (item.status || "").toLowerCase();

    const categoryOk =
      !category || itemCategory.includes(category.toLowerCase());
    const statusOk = !status || itemStatus === status.toLowerCase();

    return categoryOk && statusOk;
  });
}

/**
 * Filtre une liste d'éléments par recherche texte
 * @param {Array} items - tableau d'objets
 * @param {string} query - texte à rechercher
 * @param {Array} fields - champs à inspecter (ex: ["nom","description"])
 * @returns {Array} - éléments filtrés
 */
export function filterByText(items, query = "", fields = []) {
  if (!query) return items;
  const q = query.toLowerCase();

  return items.filter((item) =>
    fields.some((field) => (item[field] || "").toLowerCase().includes(q))
  );
}
