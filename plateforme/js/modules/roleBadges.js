export function initRoleBadges() {
    document.querySelectorAll('.role-badge').forEach(badge => {
        const role = badge.dataset.role;

        const roleStyles = {
            admin: { color: '#c62828', icon: '🛡️' },
            organisateur: { color: '#ef6c00', icon: '🎯' },
            joueur: { color: '#1565c0', icon: '🎮' }
        };

        if (roleStyles[role]) {
            badge.style.backgroundColor = roleStyles[role].color;
            badge.dataset.icon = roleStyles[role].icon + ' ';
        }
    });
}
