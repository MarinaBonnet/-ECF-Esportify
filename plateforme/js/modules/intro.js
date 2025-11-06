
export function initIntro() {
    const container = document.querySelector(".intro");
    const logo = container.querySelector(".logo-img");
    const canvas = container.querySelector(".explosion");
    const flash = container.querySelector(".flash");
    const sound = container.querySelector(".sound");
    const site = document.querySelector(".site-content");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    logo.addEventListener("click", () => {
        logo.style.opacity = "0";

        setTimeout(() => {
            //logo.classList.add("hidden");
            canvas.classList.remove("hidden");
            flash.classList.remove("hidden");

            // Flash lumineux
            flash.style.opacity = "1";
            setTimeout(() => {
                flash.style.opacity = "0";
            }, 100);

            // Tempête d’éclairs
            startLightning(ctx, canvas.width, canvas.height, container, canvas, site);
            sound.play().catch((err) => console.warn("son bloqué :", err));
        }, 500);
    });
}

//Animation tempete d'eclairs
export function startLightning(ctx, w, h, container, canvas, site) {
    let frames = 0;

    function animate() {
        ctx.clearRect(0, 0, w, h);

        for (let i = 0; i < 5; i++) {
            const startX = Math.random() * w;
            const startY = Math.random() * h;
            drawLightning(ctx, startX, startY);
        }

        frames++;
        if (frames < 420) {
            requestAnimationFrame(animate);
        } else {
            container.classList.add("fade-out");

            setTimeout(() => {
                container.remove();
                canvas.remove();
                site.classList.add("visible");
            }, 1500);
        }
    }

    animate();
}

export function drawLightning(ctx, x, y) {
    const hue = Math.floor(Math.random() * 60 + 240); // bleu-violet
    ctx.strokeStyle = `hsla(${hue}, 100%, 70%, 0.8)`;
    ctx.lineWidth = Math.random() * 4 + 2; //epaisseur éclair
    ctx.beginPath();
    ctx.moveTo(x, y);

    const segments = Math.floor(Math.random() * 12 + 8); //plus de segments
    for (let i = 0; i < segments; i++) {
        x += (Math.random() - 0.5) * 60; // plus large
        y += (Math.random() - 0.5) * 60;
        ctx.lineTo(x, y);
    }

    ctx.stroke();
}
