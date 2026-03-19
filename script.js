const canvas = document.getElementById('starCanvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startBtn');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const container = document.querySelector('.scroll-container');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const staticStars = []; 
const heartStars = [];  
const heartPoints = [];
const shootingStars = []; // Untuk Bintang Jatuh
const scale = 20; 

let animProgress = 0;
let isMoving = false;

// 1. Data posisi Hati
function createHeartData() {
    heartPoints.length = 0;
    for (let t = 0; t < Math.PI * 2; t += 0.08) {
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        heartPoints.push({
            x: canvas.width / 2 + x * scale,
            y: canvas.height / 2 + y * scale
        });
    }
}

// 2. Inisialisasi Bintang
function initStars() {
    staticStars.length = 0;
    heartStars.length = 0;

    for (let i = 0; i < 300; i++) {
        staticStars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 1.5,
            opacity: Math.random(),
            blink: Math.random() * 0.05
        });
    }

    heartPoints.forEach((pt) => {
        heartStars.push({
            startX: Math.random() * canvas.width,
            startY: Math.random() * canvas.height,
            targetX: pt.x,
            targetY: pt.y,
            size: Math.random() * 2 + 1,
            delay: Math.random() * 0.5
        });
    });
}

// 3. Fungsi Gambar Bintang Utama
function drawStar(x, y, size, opacity) {
    ctx.beginPath();
    ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
    ctx.lineWidth = 1;
    ctx.moveTo(x, y - size); ctx.lineTo(x, y + size);
    ctx.moveTo(x - size, y); ctx.lineTo(x + size, y);
    ctx.stroke();
}

// 4. EFEK KONSTELASI (Garis antar bintang hati)
function drawConstellation(points) {
    if (animProgress < 0.6) return; // Muncul saat bintang sudah hampir membentuk hati
    ctx.strokeStyle = `rgba(255, 255, 255, ${(animProgress - 0.6) * 0.2})`;
    ctx.lineWidth = 0.5;
    const maxDist = 70;

    for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
            const dx = points[i].x - points[j].x;
            const dy = points[i].y - points[j].y;
            if (Math.sqrt(dx*dx + dy*dy) < maxDist) {
                ctx.beginPath();
                ctx.moveTo(points[i].x, points[i].y);
                ctx.lineTo(points[j].x, points[j].y);
                ctx.stroke();
            }
        }
    }
}

// 5. EFEK BINTANG JATUH (Shooting Stars)
function updateShootingStars() {
    if (Math.random() < 0.015) {
        shootingStars.push({
            x: Math.random() * canvas.width, y: 0,
            len: Math.random() * 50 + 20, speed: Math.random() * 10 + 5, opacity: 1
        });
    }
    shootingStars.forEach((ss, i) => {
        ctx.strokeStyle = `rgba(255, 255, 255, ${ss.opacity})`;
        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(ss.x - ss.len, ss.y + ss.len);
        ctx.stroke();
        ss.x -= ss.speed; ss.y += ss.speed; ss.opacity -= 0.02;
        if (ss.opacity <= 0) shootingStars.splice(i, 1);
    });
}

// 6. LOOP ANIMASI UTAMA
function animate() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (isMoving && animProgress < 1) animProgress += 0.01;

    updateShootingStars(); // Gambar Bintang Jatuh

    // Gambar Bintang Latar
    staticStars.forEach(s => {
        let blink = s.opacity + Math.sin(Date.now() * s.blink) * 0.3;
        drawStar(s.x, s.y, s.size, blink);
    });

    let currentPoints = [];

    // Update & Simpan Posisi Bintang Hati
    heartStars.forEach(s => {
        let p = Math.max(0, (animProgress - s.delay) / (1 - s.delay));
        let ease = 1 - Math.pow(1 - p, 3);
        let cx = s.startX + (s.targetX - s.startX) * ease;
        let cy = s.startY + (s.targetY - s.startY) * ease;
        
        drawStar(cx, cy, s.size, 0.8);
        currentPoints.push({x: cx, y: cy});
    });

    drawConstellation(currentPoints); // Gambar Garis Konstelasi

    requestAnimationFrame(animate);
}

// 7. LOGIKA TOMBOL
startBtn.onclick = () => {
    isMoving = true;
    container.classList.add('active');
};

yesBtn.onclick = () => {
    window.location.href = 'love.html'; // Pindah ke halaman love.html
};

// Tombol NO dibuat tidak aktif/tidak lari
noBtn.style.opacity = "0.5";
noBtn.style.cursor = "not-allowed";
noBtn.onclick = (e) => e.preventDefault();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createHeartData();
    initStars();
});

createHeartData();
initStars();
animate();
