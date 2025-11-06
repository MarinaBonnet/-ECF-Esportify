// formDebug.js
export function openModalAndValidate(id) {
    const modal = document.getElementById(id);
    if (!modal || typeof modal.showModal !== "function") {
        console.error(`❌ Modale "${id}" introuvable ou non compatible`);
        return;
    }

    modal.showModal();
    console.log(`✅ Modale "${id}" ouverte`);

    const form = modal.querySelector("form");
    if (!form) {
        console.warn(`⚠️ Aucun formulaire trouvé dans "${id}"`);
        return;
    }

    const fields = form.querySelectorAll("input, textarea, select");
    for (const field of fields) {
        const name = field.name || field.id || "[sans nom]";
        if (field.offsetParent === null || field.disabled) {
            console.warn(`⚠️ Champ "${name}" non focusable`);
        } else {
            console.log(`✅ Champ "${name}" est focusable`);
        }
    }
}
