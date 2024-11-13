// Utility functions to show/hide elements
function hideElement(element) {
    element.classList.add("hidden");
}

function showElement(element) {
    element.classList.remove("hidden");
}

// DOM Elements
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

// Get game over elements
const gameOverOverlay = document.getElementById("game-over-overlay");
const finalScoreElement = document.getElementById("final-score");
const restartButton = document.getElementById("restart-button");
const backToMenuButton = document.getElementById("back-to-menu-button");

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

// Initial game state and settings
let snake = [
    { x: 15 * tileSize, y: 19 * tileSize },
    { x: 16 * tileSize, y: 19 * tileSize },
    { x: 17 * tileSize, y: 19 * tileSize }
];
let foodPosition = { x: Math.floor(Math.random() * 20) * tileSize, y: Math.floor(Math.random() * 20 + 3) * tileSize };
let score = 0, direction = "left", gameSpeed = 125, lastKey = 0, safeDelay = 130, gameLoop;
let isPaused = false;
let soundEnabled = false; // New setting for sound
let wallsEnabled = false; // New setting for walls

// Set up listener for walls checkbox
document.getElementById("walls-checkbox").addEventListener("change", function(event) {
    wallsEnabled = event.target.checked;
});

// Set up listeners for speed radio buttons
document.querySelectorAll('input[name="speed"]').forEach((radio) => {
    radio.addEventListener("change", (event) => {
        const selectedSpeed = event.target.value;
        if (selectedSpeed === "slow") gameSpeed = 200;
        else if (selectedSpeed === "medium") gameSpeed = 125;
        else if (selectedSpeed === "fast") gameSpeed = 75;

        // Restart game loop to apply new speed
        if (!isPaused) {
            clearInterval(gameLoop);
            startGameLoop();
        }
    });
});

// Keydown listener for snake movement and pause
document.addEventListener("keydown", function (event) {
    if (Date.now() - lastKey > safeDelay) {
        const newDirection = { 38: "up", 40: "down", 37: "left", 39: "right" }[event.keyCode];
        if (newDirection && newDirection !== { up: "down", down: "up", left: "right", right: "left" }[direction]) {
            direction = newDirection;
        }
        lastKey = Date.now();
    }
    // Pause/Resume when the spacebar is pressed
    if (event.keyCode === 32) {
        togglePauseResume();
    }
});

// Toggle between pause and resume
function togglePauseResume() {
    if (!isPaused && gameOverOverlay.classList.contains("hidden")) {
        pauseGame();
    } else if (isPaused && gameOverOverlay.classList.contains("hidden")) {
        resumeGame();
    }
}

// Pause the game
function pauseGame() {
    clearInterval(gameLoop);  
    isPaused = true;  
    pauseOverlay.style.visibility = "visible"; 
}

// Resume the game
function resumeGame() {
    if (!gameOverOverlay.classList.contains("hidden")) return;
    startGameLoop();
    isPaused = false;  
    pauseOverlay.style.visibility = "hidden";  
}

// Start the game loop
function startGameLoop() {
    clearInterval(gameLoop); // Clear any existing game loop
    gameLoop = setInterval(() => {
        updateGame();
        drawGame();
    }, gameSpeed);
}

// Generates a new random position for the food
function generateNewFood() {
    foodPosition = { x: Math.floor(Math.random() * 20) * tileSize, y: Math.floor(Math.random() * 20 + 3) * tileSize };
}

// Update game state
function updateGame() {
    let snakeHeadX = snake[0].x, snakeHeadY = snake[0].y;

    // Adjust the snake's head position
    if (direction === "up") snakeHeadY -= tileSize;
    else if (direction === "down") snakeHeadY += tileSize;
    else if (direction === "left") snakeHeadX -= tileSize;
    else if (direction === "right") snakeHeadX += tileSize;

    // Handle wall or wrap-around logic based on wallsEnabled
    if (wallsEnabled) {
        // End game if snake hits the wall
        if (snakeHeadX >= gameCanvas.width || snakeHeadX < 0 || snakeHeadY >= gameCanvas.height || snakeHeadY < tileSize * 3) {
            endGame();
            return;
        }
    } else {
        // Wrap-around behavior
        if (snakeHeadX >= gameCanvas.width) snakeHeadX = 0;
        if (snakeHeadX < 0) snakeHeadX = gameCanvas.width - tileSize;
        if (snakeHeadY >= gameCanvas.height) snakeHeadY = tileSize * 3;
        if (snakeHeadY < tileSize * 3) snakeHeadY = gameCanvas.height - tileSize;
    }

    let snakeHead = { x: snakeHeadX, y: snakeHeadY };

    // Check for food collision
    if (snakeHead.x === foodPosition.x && snakeHead.y === foodPosition.y) {
        generateNewFood();
        snake.unshift(snakeHead);
        score++;
        if (soundEnabled) {
            console.log("Play eat sound"); // Placeholder for sound effect
        }
    } else {
        snake.unshift(snakeHead);
        snake.pop();
    }

    // Check for self-collision
    if (snake.some((segment, index) => index > 0 && snakeHead.x === segment.x && snakeHead.y === segment.y)) {
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

// When the game ends, save the score to high scores
function endGame() {
    clearInterval(gameLoop);
    isPaused = true;
    finalScoreElement.textContent = `Your final score is: ${score}`;
    gameOverOverlay.classList.remove("hidden");

    // Save the score to high scores
    saveHighScore(score);
}

// Display high scores when the high scores menu is opened
highScoresButton.addEventListener("click", function () {
    hideElement(mainMenu);
    showElement(highScoresMenu);
    displayHighScores();  // Update high scores display
});

// Reset game function
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

// Event listener for restart button
restartButton.addEventListener("click", function () {
    clearInterval(gameLoop);
    resetGame();
    startGameLoop();
});

// Go back to the main menu
backToMenuButton.addEventListener("click", function () {
    clearInterval(gameLoop);
    resetGame();
    hideElement(gameBoardContainer);
    showMainMenu();
});

// Main Menu Logic
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


