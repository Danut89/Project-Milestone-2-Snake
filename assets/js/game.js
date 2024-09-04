
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


// Initial gamestate

// Initial snake configuration with 3 body segments
let snake = [];
snake[0] = { x: 15 * tileSize, y: 19 * tileSize };
snake[1] = { x: 16 * tileSize, y: 19 * tileSize };
snake[2] = { x: 17 * tileSize, y: 19 * tileSize };
console.log(snake);


// Randomly generate food position on the board
let foodPosition = {
    x: Math.floor(Math.random() * 20) * tileSize,
    y: Math.floor(Math.random() * 20 + 3) * tileSize
  };


  // Game settings: score, movement direction, speed, and key press delay
let score = 0;
let direction = "left"; // Snake starts by moving left
let gameSpeed = 125; // Controls the game speed (lower value = faster)
let lastKey = 0; // Tracks the last key press time to prevent rapid direction changes
let safeDelay = 130; // Minimum time between key presses to avoid self-collision


// Keydown listener to change the snake's direction based on user input
document.addEventListener("keydown", function (event) {
    if (Date.now() - lastKey > safeDelay) { // Prevents quick key press issues
      if (event.keyCode === 38 && direction !== "down") direction = "up";
      else if (event.keyCode === 40 && direction !== "up") direction = "down";
      else if (event.keyCode === 37 && direction !== "right") direction = "left";
      else if (event.keyCode === 39 && direction !== "left") direction = "right";
      lastKey = Date.now(); // Update the last key press timestamp
    }
  });


  // Generates a new random position for the food
  let generateNewFood = function () {
    foodPosition = {
      x: Math.floor(Math.random() * 20) * tileSize,
      y: Math.floor(Math.random() * 20 + 3) * tileSize
    };
  };
  


// Active gamestate

function updateGame() {
    // Get the current position of the snake's head
    let snakeHeadX = snake[0].x;
    let snakeHeadY = snake[0].y;


     // Adjust the snake's head position based on the current direction
    if (direction === "up") snakeHeadY -= tileSize;
    else if (direction === "down") snakeHeadY += tileSize;
    else if (direction === "left") snakeHeadX -= tileSize;
    else if (direction === "right") snakeHeadX += tileSize;


     // Create a new head object for the snake's movement
    let snakeHead = { x: snakeHeadX, y: snakeHeadY };

    // Check if the snake eats food, increase size and generate new food
  if (snakeHead.x === foodPosition.x && snakeHead.y === foodPosition.y) {
    generateNewFood();
    snake.unshift(snakeHead); // Add new head without removing the tail
    score++; // Increment score when food is eaten
  } else {
    snake.unshift(snakeHead); // Add new head and remove tail to maintain length
    snake.pop();
  }

   // Ensure food doesn't spawn inside the snake's body
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === foodPosition.x && snake[i].y === foodPosition.y) {
      generateNewFood(); // Generate new food if it spawns inside the snake
    }
  }

   // Check for collisions between the snake's head and body
  for (let i = 1; i < snake.length; i++) {
    if (snakeHead.x === snake[i].x && snakeHead.y === snake[i].y) {
      endGame(); // Stop the game if the snake collides with itself
    }
  }

   // Check for collisions with the game board boundaries
  if (
    snakeHead.x >= gameCanvas.width || 
    snakeHead.x < 0 || 
    snakeHead.y >= gameCanvas.height || 
    snakeHead.y < tileSize * 3
  ) {
    endGame(); // Stop the game if the snake hits the wall
  }
}


// Renders the game (background, snake, food, and score)

function drawGame() {
    // Clear the background canvas
    backgroundCtx.clearRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);
    backgroundCtx.fillStyle = "#34358F"; // Background color
    backgroundCtx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    // Clear the game canvas
  gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

   

    //Draw the score background
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
    gameCtx.fillRect(snake[i].x, snake[i].y, tileSize, tileSize); // Draw snake segments
    gameCtx.strokeStyle = "white";
    gameCtx.strokeRect(snake[i].x, snake[i].y, tileSize, tileSize);
  }
}

// Ends the game and stops the update loop
function endGame() {
    console.log("Game Over");
    clearInterval(gameLoop); // Stops the game loop
    // Play game over sound (if enabled)
    // gameover.play();
  }
  
  // Main game loop: update game state and draw the game frame by frame
let mainLoop = function () {
    updateGame();
    drawGame();
    requestAnimationFrame(mainLoop); // Keep calling the loop for smooth animation
  };
  
  // Start the game loop
  requestAnimationFrame(mainLoop);
   