// modules/sidebar.js
export function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const toggleBtn = document.querySelector('.sidebar-toggle');
    const closeBtn = document.querySelector('.close-sidebar');

    if (sidebar && overlay && toggleBtn && closeBtn) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.add('open');
            overlay.classList.remove('hidden');
        });

        closeBtn.addEventListener('click', () => {
            sidebar.classList.remove('open');
            overlay.classList.add('hidden');
        });

        overlay.addEventListener('click', () => {
            sidebar.classList.remove('open');
            overlay.classList.add('hidden');
        });
    }
}
