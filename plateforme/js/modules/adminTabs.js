// modules/adminTabs.js
export function initAdminTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            document.querySelectorAll('[data-tab-content]').forEach(section => {
                section.classList.add('hidden');
            });

            const targetId = btn.dataset.tab;
            const targetSection = document.getElementById(targetId);
            if (targetSection) targetSection.classList.remove('hidden');
        });
    });
}
