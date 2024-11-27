// ==================== Utility Functions ==================== //

function hideElement(element) {
    element.classList.add("hidden");
}

function showElement(element) {
    element.classList.remove("hidden");
}

// ==================== DOM Elements ==================== //

// Main Menu and Game Control Elements
const mainMenu = document.getElementById('main-menu');
const playButton = document.getElementById('play-button');
const optionsButton = document.getElementById('options-button');  
const highScoresButton = document.getElementById('high-scores-button');  
const backOptionsButton = document.getElementById('back-options-button');  
const backScoresButton = document.getElementById('back-scores-button');  
const optionsMenu = document.getElementById("options-menu");
const highScoresMenu = document.getElementById("high-scores-menu");
const gameBoardContainer = document.getElementById("game-board-container");
const pauseOverlay = document.getElementById("pause-overlay");

// Game Over Elements
const gameOverOverlay = document.getElementById("game-over-overlay");
const finalScoreElement = document.getElementById("final-score");
const restartButton = document.getElementById("restart-button");
const backToMenuButton = document.getElementById("back-to-menu-button");

// Sound Elements
const eatSound = document.getElementById("eat-sound");
const gameOverSound = document.getElementById("game-over-sound");

// Canvas Elements
const backgroundCanvas = document.getElementById("backgroundCanvas");
backgroundCanvas.width = window.innerWidth;
backgroundCanvas.height = window.innerHeight;
let backgroundCtx = backgroundCanvas.getContext("2d");

const gameCanvas = document.getElementById("gameCanvas");
gameCanvas.width = 400;
gameCanvas.height = 460;
const gameCtx = gameCanvas.getContext("2d");


// ==================== Game Settings and State ==================== //

const tileSize = 20;
let snake = [
    { x: 15 * tileSize, y: 19 * tileSize },
    { x: 16 * tileSize, y: 19 * tileSize },
    { x: 17 * tileSize, y: 19 * tileSize }
];
let foodPosition = { x: Math.floor(Math.random() * 20) * tileSize, y: Math.floor(Math.random() * 20 + 3) * tileSize };
let score = 0, direction = "left", gameSpeed = 125, lastKey = 0, safeDelay = 130, gameLoop;
let isPaused = false;
let soundEnabled = false;
let wallsEnabled = false;


// ==================== Event Listeners ==================== //

// Options Toggle Listeners
document.getElementById("walls-checkbox").addEventListener("change", function(event) {
    wallsEnabled = event.target.checked;
});

document.getElementById("audio-checkbox").addEventListener("change", function(event) {
    soundEnabled = event.target.checked;
});

// Speed Radio Button Listeners
document.querySelectorAll('input[name="speed"]').forEach((radio) => {
    radio.addEventListener("change", (event) => {
        const selectedSpeed = event.target.value;
        gameSpeed = selectedSpeed === "slow" ? 200 : selectedSpeed === "medium" ? 125 : 75;
        if (!isPaused) {
            clearInterval(gameLoop);
            startGameLoop();
        }
    });
});

// Keydown Listener for Snake Movement and Pause
document.addEventListener("keydown", function (event) {
    if (Date.now() - lastKey > safeDelay) {
        const newDirection = { 38: "up", 40: "down", 37: "left", 39: "right" }[event.keyCode];
        if (newDirection && newDirection !== { up: "down", down: "up", left: "right", right: "left" }[direction]) {
            direction = newDirection;
        }
        lastKey = Date.now();
    }
    if (event.keyCode === 32) togglePauseResume();
});


// ==================== Game Control Functions ==================== //

// Toggle Pause and Resume
function togglePauseResume() {
    if (!isPaused && gameOverOverlay.classList.contains("hidden")) {
        pauseGame();
    } else if (isPaused && gameOverOverlay.classList.contains("hidden")) {
        resumeGame();
    }
}

// Pause Game
function pauseGame() {
    clearInterval(gameLoop);  
    isPaused = true;  
    pauseOverlay.style.visibility = "visible"; 
}

// Resume Game
function resumeGame() {
    if (!gameOverOverlay.classList.contains("hidden")) return;
    startGameLoop();
    isPaused = false;  
    pauseOverlay.style.visibility = "hidden";  
}

// Start Game Loop
function startGameLoop() {
    clearInterval(gameLoop);
    gameLoop = setInterval(() => {
        updateGame();
        drawGame();
    }, gameSpeed);
}

// Reset Game
function resetGame() {
    snake = [
        { x: 15 * tileSize, y: 19 * tileSize },
        { x: 16 * tileSize, y: 19 * tileSize },
        { x: 17 * tileSize, y: 19 * tileSize }
    ];
    direction = "left";  
    score = 0;
    generateNewFood();
    isPaused = false;
    lastKey = 0;
    gameOverOverlay.classList.add("hidden");
    pauseOverlay.style.visibility = "hidden";
}


// ==================== Game Logic ==================== //

// Generate New Food Position
function generateNewFood() {
    foodPosition = { x: Math.floor(Math.random() * 20) * tileSize, y: Math.floor(Math.random() * 20 + 3) * tileSize };
}

// Update Game State
function updateGame() {
    let snakeHeadX = snake[0].x, snakeHeadY = snake[0].y;

    if (direction === "up") snakeHeadY -= tileSize;
    else if (direction === "down") snakeHeadY += tileSize;
    else if (direction === "left") snakeHeadX -= tileSize;
    else if (direction === "right") snakeHeadX += tileSize;

    if (wallsEnabled) {
        if (snakeHeadX >= gameCanvas.width || snakeHeadX < 0 || snakeHeadY >= gameCanvas.height || snakeHeadY < tileSize * 3) {
            endGame();
            return;
        }
    } else {
        if (snakeHeadX >= gameCanvas.width) snakeHeadX = 0;
        if (snakeHeadX < 0) snakeHeadX = gameCanvas.width - tileSize;
        if (snakeHeadY >= gameCanvas.height) snakeHeadY = tileSize * 3;
        if (snakeHeadY < tileSize * 3) snakeHeadY = gameCanvas.height - tileSize;
    }

    let snakeHead = { x: snakeHeadX, y: snakeHeadY };

    if (snakeHead.x === foodPosition.x && snakeHead.y === foodPosition.y) {
        generateNewFood();
        snake.unshift(snakeHead);
        score++;
        if (soundEnabled) eatSound.play();  // Play eating sound
    } else {
        snake.unshift(snakeHead);
        snake.pop();
    }

    if (snake.some((segment, index) => index > 0 && snakeHead.x === segment.x && snakeHead.y === segment.y)) {
        endGame();
    }
}

// Draw Game Elements
function drawGame() {
    backgroundCtx.clearRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);
    backgroundCtx.fillStyle = "#34358F";
    backgroundCtx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    gameCtx.fillStyle = "#2C2C42";
    gameCtx.fillRect(0, 0, gameCanvas.width, tileSize * 3);

    gameCtx.fillStyle = "white";
    gameCtx.font = "40px Verdana";
    gameCtx.fillText(score, tileSize, tileSize * 2.25);

    gameCtx.beginPath();
    gameCtx.arc(foodPosition.x + (tileSize - 3) / 2, foodPosition.y + (tileSize - 3) / 2, tileSize / 2, 0, 2 * Math.PI);
    gameCtx.fillStyle = "#AE00C2";
    gameCtx.fill();
    gameCtx.strokeStyle = "white";
    gameCtx.stroke();

    gameCtx.fillStyle = "#181942";
    snake.forEach(segment => {
        gameCtx.fillRect(segment.x, segment.y, tileSize, tileSize);
        gameCtx.strokeRect(segment.x, segment.y, tileSize, tileSize);
    });
}


// ==================== Game Over Logic ==================== //

function endGame() {
    clearInterval(gameLoop);
    isPaused = true;
    finalScoreElement.textContent = `Your final score is: ${score}`;
    gameOverOverlay.classList.remove("hidden");
    if (soundEnabled) gameOverSound.play();
    saveHighScore(score);
}


// ==================== Menu Navigation ==================== //

playButton.addEventListener("click", function () {
    hideElement(mainMenu);
    showElement(gameBoardContainer);
    startGameLoop();  
});

const optionsPlayButton = document.getElementById("options-play-button");
optionsPlayButton.addEventListener("click", function () {
    hideElement(optionsMenu);

    showElement(gameBoardContainer);
    resetGame();
    startGameLoop();
});


highScoresButton.addEventListener("click", function () {
    hideElement(mainMenu);
    showElement(highScoresMenu);

    displayHighScores();
});

optionsButton.addEventListener("click", function () {
    hideElement(mainMenu);
    showElement(optionsMenu);
});

backOptionsButton.addEventListener("click", function () {
    hideElement(optionsMenu);
    showElement(mainMenu);
});

backScoresButton.addEventListener("click", function () {
    hideElement(highScoresMenu);
    showElement(mainMenu);
});

restartButton.addEventListener("click", function () {
    clearInterval(gameLoop);
    resetGame();
    startGameLoop();
});

backToMenuButton.addEventListener("click", function () {
    clearInterval(gameLoop);
    resetGame();
    hideElement(gameBoardContainer);
    showMainMenu();
});


// ==================== Initial Setup ==================== //

// Show main menu at start
function showMainMenu() {
    showElement(mainMenu);
    hideElement(gameBoardContainer);
}

// Start the game with main menu shown and game loop NOT started
showMainMenu();