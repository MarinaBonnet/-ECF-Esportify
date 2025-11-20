export function initIntro() {
  const intro = document.querySelector(".intro");
  const siteContent = document.querySelector(".site-content");
  const flash = intro?.querySelector(".flash");
  const explosion = intro?.querySelector(".explosion");
  const sound = intro?.querySelector(".sound");
  const progressFill = intro?.querySelector(".progress-fill");

  if (!intro || !siteContent || !explosion || !progressFill) return;

  const ctx = explosion.getContext("2d");
  explosion.width = window.innerWidth;
  explosion.height = window.innerHeight;

  // Jouer le son
  sound?.play().catch(() => {});

  let progress = 0;
  const interval = setInterval(() => {
    progress += 5;
    progressFill.style.width = progress + "%";

    if (progress >= 100) {
      clearInterval(interval);

      // Flash + éclairs
      flash.style.opacity = "1";
      setTimeout(() => {
        flash.style.opacity = "0";
      }, 300);

      for (let i = 0; i < 5; i++) {
        const x = Math.random() * explosion.width;
        const y = Math.random() * explosion.height;
        drawLightning(ctx, x, y);
      }

      // Fade out intro
      intro.classList.add("fade-out");
      setTimeout(() => {
        intro.classList.add("hidden");
        siteContent.classList.add("visible");
      }, 1500);
    }
  }, 150); // vitesse de remplissage
}
function drawLightning(ctx, x, y) {
  const hue = Math.floor(Math.random() * 60 + 240);
  ctx.strokeStyle = `hsla(${hue}, 100%, 70%, 0.8)`;
  ctx.lineWidth = Math.random() * 4 + 2;
  ctx.beginPath();
  ctx.moveTo(x, y);

  const segments = Math.floor(Math.random() * 12 + 8);
  for (let i = 0; i < segments; i++) {
    x += (Math.random() - 0.5) * 60;
    y += (Math.random() - 0.5) * 60;
    ctx.lineTo(x, y);
  }
  ctx.stroke();
}
