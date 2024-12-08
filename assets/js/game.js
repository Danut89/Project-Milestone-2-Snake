// ==================== Utility Functions ==================== //

function hideElement(element) {
    element.classList.add("hidden");
}

function showElement(element) {
    element.classList.remove("hidden");
}

// Generate a random number between min and max
const randomNumber = (min, max) => Math.random() * (max - min) + min;

// Convert seconds into HH:MM:SS format
const convertSecondsToHms = (d) => {
    d = Number(d);
    let h = Math.floor(d / 3600);
    let m = Math.floor((d % 3600) / 60);
    let s = Math.floor((d % 3600) % 60);
    let hDisplay = h > 0 ? h + (h == 1 ? " hour " : " hours ") : "";
    let mDisplay = m > 0 ? m + (m == 1 ? " minute " : " minutes ") : "";
    let sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return hDisplay + mDisplay + sDisplay;
};

// Calculate dynamic output based on tile size
const dynamicOutput = (ratio) => tileSize * ratio;

// ==================== DOM Elements ==================== //

// Menu and game control elements
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
const pauseRestartButton = document.getElementById("pause-restart-button");
const quitButtonPause = document.querySelector('.quit-button');

// Game Over elements
const gameOverOverlay = document.getElementById("game-over-overlay");
const finalScoreElement = document.getElementById("final-score");
const restartButton = document.getElementById("restart-button");
const backToMenuButton = document.getElementById("back-to-menu-button");

// Sound elements
const buttonSound = document.getElementById("button-sound");
const eatSound = document.getElementById("eat-sound");
const gameOverSound = document.getElementById("game-over-sound");

// Canvas elements
const backgroundCanvas = document.getElementById("backgroundCanvas");
backgroundCanvas.width = window.innerWidth;
backgroundCanvas.height = window.innerHeight;
let backgroundCtx = backgroundCanvas.getContext("2d");

const gameCanvas = document.getElementById("gameCanvas");
gameCanvas.width = 400;
gameCanvas.height = 460;
const gameCtx = gameCanvas.getContext("2d");

// ==================== Hammer.js Configuration ==================== //

// Initialize Hammer.js on the game canvas
const hammer = new Hammer(document.body);

// Configure Hammer.js for swipe gestures and multi-touch
hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL });
hammer.get('tap').set({ taps: 1 });
hammer.get('doubletap').set({ taps: 2 }); // Enable double-tap detection

// ==================== Game Settings and State ==================== //

const tileSize = 20;
let snake = [
    { x: 15 * tileSize, y: 19 * tileSize },
    { x: 16 * tileSize, y: 19 * tileSize },
    { x: 17 * tileSize, y: 19 * tileSize }
];
let foodPosition = { x: Math.floor(Math.random() * 20) * tileSize, y: Math.floor(Math.random() * 20 + 3) * tileSize };
let foodColor = null;
let score = 0, direction = "left", gameSpeed = 125, lastKey = 0, safeDelay = 130, gameLoop;
let isPaused = false;
let soundEnabled = false;
let wallsEnabled = false;

// Colors and sparks
const sparks = [];
const colorArray = [
    "rgba(255, 53, 94, 1)", "rgba(253, 91, 120, 1)", "rgba(255, 96, 55, 1)",
    "rgba(255, 153, 102, 1)", "rgba(255, 153, 51, 1)", "rgba(255, 204, 51, 1)",
    "rgba(255, 255, 102, 1)", "rgba(204, 255, 0, 1)", "rgba(102, 255, 102, 1)",
    "rgba(170, 240, 209, 1)", "rgba(80, 191, 230, 1)"
];

// ==================== Spark Class and Generation ==================== //

// Spark Class Constructor
class Spark {
    constructor(x, y, dx, dy, color) {
        this.x = x; // Initial x position
        this.y = y; // Initial y position
        this.dx = dx; // Horizontal velocity for spread
        this.dy = dy; // Vertical velocity
        this.radius = randomNumber(2, 5); // Random size
        this.color = color; // Spark color
        this.gravity = 10; // Gravity effect for smoother fall
        this.friction = 1; // Friction to slow down horizontal motion
        this.ttl = 30; // Time to live (frames)
        this.opacity = 1; // Opacity for fading effect
    }

    draw() {
        gameCtx.save();
        gameCtx.beginPath();
        gameCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        gameCtx.fillStyle = this.color.replace("1)", `${this.opacity})`); // Adjust opacity
        gameCtx.fill();
        gameCtx.closePath();
        gameCtx.restore();
    }

    update() {
        this.x += this.dx; // Apply horizontal velocity
        this.y += this.dy; // Apply vertical velocity
        this.dy += this.gravity; // Simulate gravity
        this.dx *= this.friction; // Apply friction to horizontal motion
        this.ttl--; // Reduce time to live
        this.opacity -= 1 / this.ttl; // Gradually decrease opacity
        this.draw(); // Draw the spark
    }
}

// Generate Sparks Function
function generateSparks(x, y) {
    const randomColor = colorArray[Math.floor(Math.random() * colorArray.length)]; // Random color for all sparks
    for (let i = 0; i < 30; i++) { // Increase number of sparks for a fuller effect
        const angle = Math.random() * 2 * Math.PI; // Random direction
        const speed = randomNumber(1, 3); // Random speed for movement
        const dx = Math.cos(angle) * speed; // Horizontal velocity
        const dy = Math.sin(angle) * speed; // Vertical velocity
        sparks.push(new Spark(x, y, dx, dy, randomColor)); // Add spark with adjusted behavior
    }
}

// ==================== Event Listeners ==================== //

// Toggle options for walls and audio
document.getElementById("walls-checkbox").addEventListener("change", function (event) {
    wallsEnabled = event.target.checked;
    const gameCanvas = document.getElementById("gameCanvas");
    if (wallsEnabled) {
        gameCanvas.classList.add("walls-enabled");
    } else {
        gameCanvas.classList.remove("walls-enabled");
    }
});

document.getElementById("audio-checkbox").addEventListener("change", function(event) {
    soundEnabled = event.target.checked;
});

document.querySelectorAll(".menu-button").forEach((button) => {
    button.addEventListener("click", () => {
        buttonSound.currentTime = 0;
        buttonSound.play();
    });
});

// Adjust game speed
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

// Movement and pause controls
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

// Add gesture controls with Hammer.js
hammer.on('panleft panright panup pandown', (event) => {
    if (event.type === 'panleft' && direction !== 'right') {
        direction = 'left';
    } else if (event.type === 'panright' && direction !== 'left') {
        direction = 'right';
    } else if (event.type === 'panup' && direction !== 'down') {
        direction = 'up';
    } else if (event.type === 'pandown' && direction !== 'up') {
        direction = 'down';
    }
});

hammer.on('doubletap', togglePauseResume);

// ==================== Game Control Functions ==================== //

// Pause and resume game
function togglePauseResume() {
    if (!isPaused && gameOverOverlay.classList.contains("hidden")) {
        pauseGame();
    } else if (isPaused && gameOverOverlay.classList.contains("hidden")) {
        resumeGame();
    }
}

function pauseGame() {
    clearInterval(gameLoop);  
    isPaused = true;  
    pauseOverlay.style.visibility = "visible"; 
}

function resumeGame() {
    if (!gameOverOverlay.classList.contains("hidden")) return;
    startGameLoop();
    isPaused = false;  
    pauseOverlay.style.visibility = "hidden";  
}

function startGameLoop() {
    clearInterval(gameLoop);
    gameLoop = setInterval(() => {
        updateGame();
        drawGame();
    }, gameSpeed);
}

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

// Generate new food at a random position with a random color
function generateNewFood() {
    let isOverlapping;

    do {
        // Generate random food position
        foodPosition = { 
            x: Math.floor(Math.random() * 20) * tileSize, 
            y: Math.floor(Math.random() * 20 + 3) * tileSize 
        };

        // Check if food position overlaps with the snake
        isOverlapping = snake.some(segment => segment.x === foodPosition.x && segment.y === foodPosition.y);

    } while (isOverlapping); // Repeat until a valid position is found

    // Assign a random color to the food
    foodColor = colorArray[Math.floor(Math.random() * colorArray.length)];
}


// Update game state
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
        generateSparks(foodPosition.x + tileSize / 2, foodPosition.y + tileSize / 2);
        generateNewFood();
        snake.unshift(snakeHead);
        score++;
        if (soundEnabled) eatSound.play();
    } else {
        snake.unshift(snakeHead);
        snake.pop();
    }

    if (snake.some((segment, index) => index > 0 && snakeHead.x === segment.x && snakeHead.y === segment.y)) {
        endGame();
    }
}

// Draw all game elements
function drawGame() {
    backgroundCtx.clearRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);
    backgroundCtx.fillStyle = "#152f20";
    backgroundCtx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    gameCtx.fillStyle = "#594910";
    gameCtx.fillRect(0, 0, gameCanvas.width, tileSize * 3);

    gameCtx.fillStyle = "white";
    gameCtx.font = "36px Poppins";
    gameCtx.fillText("Score: " + score, tileSize, tileSize * 2.25);

    // Draw the border underneath the header
    if (wallsEnabled) {
        gameCtx.fillStyle = "#f9ca24"; // Yellow border when walls are enabled
    } else {
        gameCtx.fillStyle ="#00ffcc"; // Match the header background color when walls are disabled
    }
    gameCtx.fillRect(0, tileSize * 3, gameCanvas.width, 4); // Draw the border

    // Wall icon for "walls on" and "walls off"
    const iconX = gameCanvas.width - tileSize * 6;  // Move icon and text further left for better alignment
    const iconY = tileSize * 2.25 - 18;  // Align icon vertically with the score

    // Set smaller font size for the wall status text
    gameCtx.font = "18px Poppins"; // Smaller font size for text

    // Add space between icon and text
    const spaceBetween = 10; // Adjust the space between icon and text

    if (wallsEnabled) {
        // Draw a small rectangle to represent a "wall" (solid)
        gameCtx.fillStyle = "#f9ca24"; // Yellow color for walls
        gameCtx.fillRect(iconX, iconY, 16, 16);  // Small solid square as icon
        gameCtx.fillText("Walls On", iconX + 18 + spaceBetween, iconY + 12); // Text with added space after icon
    } else {
        // Draw an outline of a rectangle for "walls off"
        gameCtx.strokeStyle = "#00ffcc";  // Light color for the walls off state
        gameCtx.lineWidth = 2;
        gameCtx.strokeRect(iconX, iconY, 16, 16);  // Draw an empty square
        gameCtx.fillText("Walls Off", iconX + 18 + spaceBetween, iconY + 12); // Text with added space after icon
    }




    gameCtx.beginPath();
    gameCtx.arc(foodPosition.x + (tileSize - 3) / 2, foodPosition.y + (tileSize - 3) / 2, tileSize / 2, 0, 2 * Math.PI);
    gameCtx.fillStyle = foodColor;
    gameCtx.fill();
    gameCtx.strokeStyle = "white";
    gameCtx.stroke();

    gameCtx.fillStyle = "#2E8B57"; // Snake color
    snake.forEach((segment, index) => {
        // Draw the body segments
        gameCtx.fillRect(segment.x, segment.y, tileSize, tileSize);
        gameCtx.strokeStyle = "#502c2e"; // Stroke color for the body (optional)
        gameCtx.lineWidth = 2; // Stroke width
        gameCtx.strokeRect(segment.x, segment.y, tileSize, tileSize);
        
        // Add eyes and tongue to the head (first segment in the snake array)
        if (index === 0) { // Head of the snake
            gameCtx.fillStyle = "white"; // Eye color
            // Left eye
            gameCtx.beginPath();
            gameCtx.arc(segment.x + tileSize * 0.3, segment.y + tileSize * 0.3, 4, 0, 2 * Math.PI);
            gameCtx.fill();
        
            // Right eye
            gameCtx.beginPath();
            gameCtx.arc(segment.x + tileSize * 0.7, segment.y + tileSize * 0.3, 4, 0, 2 * Math.PI);
            gameCtx.fill();
        
            // Optionally, add pupils for the eyes
            gameCtx.fillStyle = "black"; // Pupil color
            gameCtx.beginPath();
            gameCtx.arc(segment.x + tileSize * 0.3, segment.y + tileSize * 0.3, 2, 0, 2 * Math.PI); // Left pupil
            gameCtx.arc(segment.x + tileSize * 0.7, segment.y + tileSize * 0.3, 2, 0, 2 * Math.PI); // Right pupil
            gameCtx.fill();
    
            // Draw the tongue
            gameCtx.fillStyle = "#2E8B57"; // Tongue color
            gameCtx.beginPath();
            gameCtx.moveTo(segment.x + tileSize * 0.5, segment.y + tileSize); // Starting point (center of the head)
            gameCtx.lineTo(segment.x + tileSize * 0.5, segment.y + tileSize * 1.2); // Extend the tongue down
            gameCtx.lineWidth = 3; // Make the tongue slightly thicker
            gameCtx.strokeStyle = "red"; // Optional: add stroke to the tongue
            gameCtx.stroke();
            gameCtx.fill();
        }
    });
    
    


    // Draw and update sparks
    sparks.forEach((spark, index) => {
        spark.update();
        if (spark.ttl <= 0 || spark.opacity <= 0) sparks.splice(index, 1); // Remove spark if time to live or opacity is 0
    });
}

// End the game
function endGame() {
    clearInterval(gameLoop);
    saveHighScore(score); // Save the current score
    displayHighScores();  // Immediately update the displayed high scores
    isPaused = true;
    finalScoreElement.textContent = `Your final score is: ${score}`;
    gameOverOverlay.classList.remove("hidden");
    if (soundEnabled) gameOverSound.play();
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

pauseRestartButton.addEventListener("click", function () {
    clearInterval(gameLoop); // Stop the current game loop
    resetGame(); // Reset the game state
    startGameLoop(); // Start a new game loop
});

quitButtonPause.addEventListener("click", function () {
    clearInterval(gameLoop);
    resetGame();
    hideElement(gameBoardContainer);
    showMainMenu();
});

// ==================== Initial Setup ==================== //

// Show main menu at the start
function showMainMenu() {
    showElement(mainMenu);
    hideElement(gameBoardContainer);
}

showMainMenu();

