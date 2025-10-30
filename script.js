// Animation machine à écrire
const text = "Site en construction";
const typewriterElement = document.getElementById("typewriter");
let charIndex = 0;

function typeWriter() {
    if (charIndex < text.length) {
        typewriterElement.textContent += text.charAt(charIndex);
        charIndex++;
        setTimeout(typeWriter, 150);
    }
}

window.addEventListener('load', () => {
    setTimeout(typeWriter, 500);
});

// Jeu Snake
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const restartBtn = document.getElementById('restartBtn');
const playBtn = document.getElementById('playBtn');
const gameOverlay = document.getElementById('gameOverlay');
const scoreDisplay = document.getElementById('score');
const codeOutput = document.getElementById('codeOutput');

const gridSize = 20;
const tileCount = 20;

const codeString = 'The brand new Javed website will be released in November 2025';

let snake = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 }
];

let dx = 1;
let dy = 0;
let food = { x: 15, y: 15 };
let score = 0;
let speed = 150;
let gameLoop;
let gameOver = false;
let gameStarted = false;
let blackHoles = [];
let codeProgress = 3;

const fruits = ['🍎', '🍒', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓'];
let currentFruit = fruits[Math.floor(Math.random() * fruits.length)];

// Bouton Play
playBtn.addEventListener('click', () => {
    gameOverlay.classList.add('hidden');
    gameStarted = true;
    init();
});

function init() {
    snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ];
    dx = 1;
    dy = 0;
    score = 0;
    speed = 150;
    gameOver = false;
    blackHoles = [];
    codeProgress = 3;
    scoreDisplay.textContent = score;
    codeOutput.textContent = codeString.substring(0, codeProgress);
    generateFood();
    generateBlackHole();
    clearInterval(gameLoop);
    if (gameStarted) {
        gameLoop = setInterval(update, speed);
    }
}

function generateFood() {
    do {
        food = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
    } while (
        snake.some(segment => segment.x === food.x && segment.y === food.y) ||
        blackHoles.some(hole => hole.x === food.x && hole.y === food.y)
    );
    currentFruit = fruits[Math.floor(Math.random() * fruits.length)];
}

function generateBlackHole() {
    if (blackHoles.length < 2 && Math.random() < 0.3) {
        let hole;
        do {
            hole = {
                x: Math.floor(Math.random() * tileCount),
                y: Math.floor(Math.random() * tileCount)
            };
        } while (
            snake.some(segment => segment.x === hole.x && segment.y === hole.y) ||
            (hole.x === food.x && hole.y === food.y) ||
            blackHoles.some(h => h.x === hole.x && h.y === hole.y)
        );
        blackHoles.push(hole);
    }
}

function teleportSnake() {
    let newPos;
    do {
        newPos = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
    } while (
        snake.some(segment => segment.x === newPos.x && segment.y === newPos.y) ||
        (newPos.x === food.x && newPos.y === food.y) ||
        blackHoles.some(hole => hole.x === newPos.x && hole.y === newPos.y)
    );
    snake[0] = newPos;
}

function update() {
    if (gameOver) return;

    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Collision avec les murs
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        endGame();
        return;
    }

    // Collision avec soi-même
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        endGame();
        return;
    }

    snake.unshift(head);

    // Collision avec trou noir
    const hitBlackHole = blackHoles.findIndex(hole => hole.x === head.x && hole.y === head.y);
    if (hitBlackHole !== -1) {
        teleportSnake();
        blackHoles.splice(hitBlackHole, 1);
        generateBlackHole();
    }

    // Manger la nourriture
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreDisplay.textContent = score;
        
        if (codeProgress < codeString.length) {
            codeProgress++;
            codeOutput.textContent = codeString.substring(0, codeProgress);
        }

        canvas.classList.add('glitch');
        setTimeout(() => canvas.classList.remove('glitch'), 500);

        generateFood();
        generateBlackHole();

        // Accélération progressive
        if (score % 50 === 0 && speed > 50) {
            speed = Math.max(50, speed * 0.95);
            clearInterval(gameLoop);
            gameLoop = setInterval(update, speed);
        }
    } else {
        snake.pop();
    }

    draw();
}

function draw() {
    // Fond
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Serpent
    ctx.fillStyle = '#00cc00';
    snake.forEach((segment, index) => {
        if (index === 0) {
            ctx.fillStyle = '#008800';
        } else {
            ctx.fillStyle = '#00cc00';
        }
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    });

    // Nourriture
    ctx.font = `${gridSize}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(currentFruit, food.x * gridSize + gridSize / 2, food.y * gridSize + gridSize / 2);

    // Trous noirs
    blackHoles.forEach(hole => {
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(hole.x * gridSize + gridSize / 2, hole.y * gridSize + gridSize / 2, gridSize / 2 - 2, 0, Math.PI * 2);
        ctx.fill();
    });
}

function endGame() {
    gameOver = true;
    clearInterval(gameLoop);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 20);
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 20);
}

// Contrôles
document.addEventListener('keydown', (e) => {
    if (gameOver) return;

    switch (e.key) {
        case 'ArrowUp':
            if (dy === 0) {
                dx = 0;
                dy = -1;
            }
            e.preventDefault();
            break;
        case 'ArrowDown':
            if (dy === 0) {
                dx = 0;
                dy = 1;
            }
            e.preventDefault();
            break;
        case 'ArrowLeft':
            if (dx === 0) {
                dx = -1;
                dy = 0;
            }
            e.preventDefault();
            break;
        case 'ArrowRight':
            if (dx === 0) {
                dx = 1;
                dy = 0;
            }
            e.preventDefault();
            break;
    }
});

// Contrôles mobiles
document.getElementById('btnUp').addEventListener('click', () => {
    if (!gameOver && dy === 0) {
        dx = 0;
        dy = -1;
    }
});

document.getElementById('btnDown').addEventListener('click', () => {
    if (!gameOver && dy === 0) {
        dx = 0;
        dy = 1;
    }
});

document.getElementById('btnLeft').addEventListener('click', () => {
    if (!gameOver && dx === 0) {
        dx = -1;
        dy = 0;
    }
});

document.getElementById('btnRight').addEventListener('click', () => {
    if (!gameOver && dx === 0) {
        dx = 1;
        dy = 0;
    }
});

restartBtn.addEventListener('click', init);

// Affichage initial du canvas sans démarrer le jeu
draw();