export function createDevOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'dev-overlay';
    overlay.style.position = 'fixed';
    overlay.style.bottom = '10px';
    overlay.style.right = '10px';
    overlay.style.background = 'rgba(0,0,0,0.8)';
    overlay.style.color = '#fff';
    overlay.style.padding = '10px 15px';
    overlay.style.borderRadius = '8px';
    overlay.style.fontFamily = 'monospace';
    overlay.style.fontSize = '14px';
    overlay.style.zIndex = '9999';
    overlay.style.display = 'none';
    document.body.appendChild(overlay);
}

export function showDevMessage(message, duration = 3000) {
    const overlay = document.getElementById('dev-overlay');
    if (!overlay) return;

    overlay.textContent = message;
    overlay.style.display = 'block';

    setTimeout(() => {
        overlay.style.display = 'none';
    }, duration);
}
