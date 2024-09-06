
//Dom Elements
const mainMenu = document.getElementById('main-menu');
const playButton = document.getElementById('play-button');
const optionButton = document.getElementById('option-button');
const highScoresButton = document.getElementById('high-socres-button');
const backOptionButton  = document.getElementById('back-option-button');
const backScoreButton = document.getElementById('back-scores-button');
const optionsMenu = document.getElementById("options-menu");
const highScoresMenu = document.getElementById("high-scores-menu");
const gameBoardContainer = document.getElementById("game-board-container");



// Set up background canvas to cover the entire screen
const backgroundCanvas = document.getElementById("backgroundCanvas");
backgroundCanvas.width = window.innerWidth;
backgroundCanvas.height = window.innerHeight;
let backgroundCtx = backgroundCanvas.getContext("2d");

// Set up game canvas with fixed width and height
const gameCanvas = document.getElementById("gameCanvas");
gameCanvas.width = 400;
gameCanvas.height = 460;
const gameCtx = gameCanvas.getContext("2d");
const tileSize = 20; // Defines the size of each grid square on the game board

// Initial game state
let snake = [];
snake[0] = { x: 15 * tileSize, y: 19 * tileSize };
snake[1] = { x: 16 * tileSize, y: 19 * tileSize };
snake[2] = { x: 17 * tileSize, y: 19 * tileSize };

let foodPosition = {
    x: Math.floor(Math.random() * 20) * tileSize,
    y: Math.floor(Math.random() * 20 + 3) * tileSize
};

let score = 0;
let direction = "left"; 
let gameSpeed = 125;
let lastKey = 0;
let safeDelay = 130;
let gameLoop;

// Keydown listener to change the snake's direction based on user input
document.addEventListener("keydown", function (event) {
    if (Date.now() - lastKey > safeDelay) {
        if (event.keyCode === 38 && direction !== "down") direction = "up";
        else if (event.keyCode === 40 && direction !== "up") direction = "down";
        else if (event.keyCode === 37 && direction !== "right") direction = "left";
        else if (event.keyCode === 39 && direction !== "left") direction = "right";
        lastKey = Date.now();
    }
});

// Generates a new random position for the food
let generateNewFood = function () {
    foodPosition = {
        x: Math.floor(Math.random() * 20) * tileSize,
        y: Math.floor(Math.random() * 20 + 3) * tileSize
    };
};

// Active game state
function updateGame() {
    let snakeHeadX = snake[0].x;
    let snakeHeadY = snake[0].y;

    // Adjust the snake's head position based on the current direction
    if (direction === "up") snakeHeadY -= tileSize;
    else if (direction === "down") snakeHeadY += tileSize;
    else if (direction === "left") snakeHeadX -= tileSize;
    else if (direction === "right") snakeHeadX += tileSize;

    let snakeHead = { x: snakeHeadX, y: snakeHeadY };

    // Check if the snake eats food, increase size and generate new food
    if (snakeHead.x === foodPosition.x && snakeHead.y === foodPosition.y) {
        generateNewFood();
        snake.unshift(snakeHead); 
        score++; 
    } else {
        snake.unshift(snakeHead);
        snake.pop();
    }

    // Ensure food doesn't spawn inside the snake's body
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === foodPosition.x && snake[i].y === foodPosition.y) {
            generateNewFood();
        }
    }

    // Check for collisions between the snake's head and body
    for (let i = 1; i < snake.length; i++) {
        if (snakeHead.x === snake[i].x && snakeHead.y === snake[i].y) {
            endGame(); 
        }
    }

    // Check for collisions with the game board boundaries
    if (
        snakeHead.x >= gameCanvas.width || 
        snakeHead.x < 0 || 
        snakeHead.y >= gameCanvas.height || 
        snakeHead.y < tileSize * 3
    ) {
        endGame(); 
    }
}

// Renders the game (background, snake, food, and score)
function drawGame() {
    // Clear the background canvas
    backgroundCtx.clearRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);
    backgroundCtx.fillStyle = "#34358F";
    backgroundCtx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    // Clear the game canvas
    gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

    // Draw the score background
    gameCtx.fillStyle = "#2C2C42";
    gameCtx.fillRect(0, 0, gameCanvas.width, tileSize * 3);

    // Display the current score
    gameCtx.fillStyle = "white";
    gameCtx.font = "40px Verdana";
    gameCtx.fillText(score, tileSize, tileSize * 2.25);

    // Draw the food
    gameCtx.beginPath();
    gameCtx.arc(foodPosition.x + (tileSize - 3) / 2, foodPosition.y + (tileSize - 3) / 2, tileSize / 2, 0, 2 * Math.PI);
    gameCtx.fillStyle = "#AE00C2";
    gameCtx.fill();
    gameCtx.strokeStyle = "white";
    gameCtx.stroke();

    // Draw the snake
    gameCtx.fillStyle = "#181942";
    for (let i = 0; i < snake.length; i++) {
        gameCtx.fillRect(snake[i].x, snake[i].y, tileSize, tileSize); 
        gameCtx.strokeStyle = "white";
        gameCtx.strokeRect(snake[i].x, snake[i].y, tileSize, tileSize);
    }
}

// Ends the game and stops the update loop
function endGame() {
    console.log("Game Over");
    clearInterval(gameLoop); 
    alert("Game Over! Your final score is: " + score);
    // Optionally reset the game
}

// Starts the game loop
function startGameLoop() {
    gameLoop = setInterval(() => {
        updateGame();
        drawGame();
    }, gameSpeed);
}


// === Main Menu Logic ===



// Start the game
startGameLoop();
