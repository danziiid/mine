const fwCanvas = document.getElementById('fireworkCanvas');
const fwCtx = fwCanvas.getContext('2d');

fwCanvas.width = window.innerWidth;
fwCanvas.height = window.innerHeight;

// Array untuk menampung partikel
let particles = [];

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.velocity = {
            x: (Math.random() - 0.5) * 8,
            y: (Math.random() - 0.5) * 8
        };
        this.alpha = 1;
        this.friction = 0.95;
    }

    draw() {
        fwCtx.globalAlpha = this.alpha;
        fwCtx.beginPath();
        fwCtx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        fwCtx.fillStyle = this.color;
        fwCtx.fill();
    }

    update() {
        this.velocity.x *= this.friction;
        this.velocity.y *= this.friction;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= 0.01;
    }
}

// Fungsi untuk memicu ledakan saat klik
window.addEventListener('click', (event) => {
    const particleCount = 30;
    const color = `hsl(${Math.random() * 360}, 100%, 50%)`; // Warna warni
    // Atau gunakan warna pink: const color = '#ff00ff';

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(event.clientX, event.clientY, color));
    }
});

function animateFireworks() {
    requestAnimationFrame(animateFireworks);
    fwCtx.clearRect(0, 0, fwCanvas.width, fwCanvas.height);

    particles.forEach((particle, index) => {
        if (particle.alpha > 0) {
            particle.update();
            particle.draw();
        } else {
            particles.splice(index, 1);
        }
    });
}

animateFireworks();