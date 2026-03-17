const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const word = "LOVE"; 
const fontSize = 16; 
const columns = Math.floor(canvas.width / fontSize);

const drops = Array(columns).fill(0).map(() => Math.floor(Math.random() * -20));

const scale = 18; 
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
let heartArea = [];
let frozenDrops = [];
let isHeartMode = false;
let isFallingHeart = false;
let fallingHeartDrops = [];

let lastTime = 0;
const fps = 13; 
const nextFrame = 1000 / fps;

function createHeartPoints() {
    heartArea = [];
    const heartLetters = "LOVE";
    let charIdx = 0;
    for (let t = 0; t < Math.PI * 2; t += 0.05) {
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        heartArea.push({
            x: Math.floor((centerX + x * scale) / fontSize) * fontSize,
            y: Math.floor((centerY + y * scale) / fontSize) * fontSize,
            char: heartLetters[charIdx % heartLetters.length]
        });
        charIdx++;
    }
}
createHeartPoints();

function draw() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.font = "bold " + fontSize + "px monospace";

    ctx.fillStyle = "#00FF41";
    frozenDrops.forEach(p => {
        ctx.fillText(p.char, p.x, p.y);
    });

    if (isFallingHeart) {
        if (frozenDrops.length > 0) {
            fallingHeartDrops.push(...frozenDrops);
            frozenDrops = [];
        }
        fallingHeartDrops.forEach((p, i) => {
            ctx.fillStyle = "#00FF41";
            ctx.fillText(p.char, p.x, p.y);
            p.y += fontSize; 
            if (p.y > canvas.height) fallingHeartDrops.splice(i, 1);
        });
        if (fallingHeartDrops.length === 0) {
            isFallingHeart = false;
            createHeartPoints();
            setTimeout(() => { isHeartMode = true; }, 3000);
        }
    }

    drops.forEach((y, i) => {
        const x = i * fontSize;
        const renderY = y * fontSize; 
        
        const charIndex = Math.abs(y) % word.length;
        const text = word[charIndex];

        ctx.fillStyle = "#00FF41"; 
        ctx.fillText(text, x, renderY);

        if (isHeartMode && !isFallingHeart) {
            heartArea.forEach((point, idx) => {
                if (x === point.x && renderY === point.y) {
                    frozenDrops.push({ x, y: point.y, char: point.char });
                    heartArea.splice(idx, 1);
                }
            });
            if (heartArea.length < 5) {
                isHeartMode = false;
                setTimeout(() => { isFallingHeart = true; }, 4000);
            }
        }

        if (renderY > canvas.height && Math.random() > 0.95) {
            drops[i] = 0;
        }
        
        drops[i]++; 
    });
}

function animate(currentTime) {
    const deltaTime = currentTime - lastTime;
    if (deltaTime >= nextFrame) {
        draw();
        lastTime = currentTime - (deltaTime % nextFrame);
    }
    requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createHeartPoints();
});

setTimeout(() => { isHeartMode = true; }, 5000);
requestAnimationFrame(animate);