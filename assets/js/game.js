
// Utility functions to show/hide elements
function hideElement(element) {
    element.classList.add("hidden");
}

function showElement(element) {
    element.classList.remove("hidden");
}

//Dom Elements
const mainMenu = document.getElementById('main-menu');
const playButton = document.getElementById('play-button');
const optionsButton = document.getElementById('options-button');  
const highScoresButton = document.getElementById('high-scores-button');  
const backOptionsButton = document.getElementById('back-options-button');  
const backScoresButton = document.getElementById('back-scores-button');  
const optionsMenu = document.getElementById("options-menu");
const highScoresMenu = document.getElementById("high-scores-menu");
const gameBoardContainer = document.getElementById("game-board-container");

// Set up background canvas
const backgroundCanvas = document.getElementById("backgroundCanvas");
backgroundCanvas.width = window.innerWidth;
backgroundCanvas.height = window.innerHeight;
let backgroundCtx = backgroundCanvas.getContext("2d");

// Set up game canvas
const gameCanvas = document.getElementById("gameCanvas");
gameCanvas.width = 400;
gameCanvas.height = 460;
const gameCtx = gameCanvas.getContext("2d");
const tileSize = 20;

// Initial game state
let snake = [
    { x: 15 * tileSize, y: 19 * tileSize },
    { x: 16 * tileSize, y: 19 * tileSize },
    { x: 17 * tileSize, y: 19 * tileSize }
];
let foodPosition = { x: Math.floor(Math.random() * 20) * tileSize, y: Math.floor(Math.random() * 20 + 3) * tileSize };
let score = 0, direction = "left", gameSpeed = 125, lastKey = 0, safeDelay = 130, gameLoop;

// Keydown listener for snake movement
document.addEventListener("keydown", function (event) {
    if (Date.now() - lastKey > safeDelay) {
        const newDirection = { 38: "up", 40: "down", 37: "left", 39: "right" }[event.keyCode];
        if (newDirection && newDirection !== { up: "down", down: "up", left: "right", right: "left" }[direction]) {
            direction = newDirection;
        }
        lastKey = Date.now();
    }
});

// Generates a new random position for the food
let generateNewFood = function () {
    foodPosition = { x: Math.floor(Math.random() * 20) * tileSize, y: Math.floor(Math.random() * 20 + 3) * tileSize };
};

// Update game state
function updateGame() {
    let snakeHeadX = snake[0].x, snakeHeadY = snake[0].y;

    // Adjust the snake's head position
    if (direction === "up") snakeHeadY -= tileSize;
    else if (direction === "down") snakeHeadY += tileSize;
    else if (direction === "left") snakeHeadX -= tileSize;
    else if (direction === "right") snakeHeadX += tileSize;

    let snakeHead = { x: snakeHeadX, y: snakeHeadY };

    if (snakeHead.x === foodPosition.x && snakeHead.y === foodPosition.y) {
        generateNewFood();
        snake.unshift(snakeHead);
        score++;
    } else {
        snake.unshift(snakeHead);
        snake.pop();
    }

    if (snake.some((segment, index) => index > 0 && snakeHead.x === segment.x && snakeHead.y === segment.y)) {
        endGame();
    }
    if (snakeHead.x >= gameCanvas.width || snakeHead.x < 0 || snakeHead.y >= gameCanvas.height || snakeHead.y < tileSize * 3) {
        endGame();
    }
}

// Draw game elements
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

// End the game and reset
function endGame() {
    clearInterval(gameLoop);
    alert(`Game Over! Your final score is: ${score}`);
    resetGame();
}

// Reset game
function resetGame() {
    snake = [
        { x: 15 * tileSize, y: 19 * tileSize },
        { x: 16 * tileSize, y: 19 * tileSize },
        { x: 17 * tileSize, y: 19 * tileSize }
    ];
    direction = "left";
    score = 0;
    generateNewFood();
    showMainMenu();
}

// Game loop
function startGameLoop() {
    gameLoop = setInterval(() => {
        updateGame();
        drawGame();
    }, gameSpeed);
}

// === Main Menu Logic ===
playButton.addEventListener("click", function () {
    hideElement(mainMenu);
    showElement(gameBoardContainer);
    startGameLoop();  
});

highScoresButton.addEventListener("click", function () {
    hideElement(mainMenu);
    showElement(highScoresMenu);
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

// Show main menu at start
function showMainMenu() {
    showElement(mainMenu);
    hideElement(gameBoardContainer);
}

// Start the game with main menu shown and game loop NOT started
showMainMenu();
