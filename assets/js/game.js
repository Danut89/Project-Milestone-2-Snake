const gameBoard = document.getElementById('gameBoard');
const ctx = gameBoard.getContext("2d");
const tile = 10;

// Initial gamestate
let direction = "left";

let food = {
    x: 15 * tile,
    y: 19 * tile
}

// Initial snake array
let snake = [];
snake[0] = { x: 19 * tile, y: 19 * tile };
snake[1] = { x: 20 * tile, y: 19 * tile };
snake[2] = { x: 21 * tile, y: 19 * tile };


// Active gamestate
function draw() {
    ctx.clearRect(0,0,gameBoard.clientWidth, gameBoard.height)  // Clear the gameboard

     // Draw the food
    ctx.fillStyle = 'green';
    ctx.fillRect(food.x, food.y, tile, tile);

    // Draw the snake
    ctx.fillStyle = 'red';
    for (let i = 0; i < snake.length; i++) {
        ctx.fillRect(snake[i].x, snake[i].y, tile, tile);
    }

    // Get current head position
    let currentHeadX = snake[0].x;
    let currentHeadY = snake[0].y;

    // Update head position based on direction
    if (direction === 'up') {
        currentHeadY -= tile;
    } else if (direction === 'down') {
        currentHeadY += tile;
    } else if (direction === 'left') {
        currentHeadX -= tile;
    } else if (direction === 'right') {
        currentHeadX += tile;
    }

    let newHead = { x: currentHeadX, y: currentHeadY };

    // Check if snake eats food
    if (currentHeadX === food.x && currentHeadY === food.y) {
        console.log('ATE FOOD');
        // Generate new food at random position
        food = {
            x: Math.floor(Math.random() * (gameBoard.width / tile)) * tile,
            y: Math.floor(Math.random() * (gameBoard.height / tile)) * tile
        };
    } else {
        // Remove tail if food not eaten
        snake.pop();
    }

    // Add new head to the snake
    snake.unshift(newHead);

    // Detect collision with self
    for (let i = 1; i < snake.length; i++) {
        if (currentHeadX === snake[i].x && currentHeadY === snake[i].y) {
            console.log('ATE SELF');
            clearInterval(game);
        }
    }

    // Detect collision with walls
    if (currentHeadX >= gameBoard.width || currentHeadX < 0 || currentHeadY >= gameBoard.height || currentHeadY < 0) {
        console.log('HIT WALL');
        clearInterval(game);
    }
}

// Control snake direction with keyboard arrows
document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowUp' && direction !== 'down') direction = 'up';
    else if (event.key === 'ArrowDown' && direction !== 'up') direction = 'down';
    else if (event.key === 'ArrowLeft' && direction !== 'right') direction = 'left';
    else if (event.key === 'ArrowRight' && direction !== 'left') direction = 'right';
});

// Start the game
let game = setInterval(draw, 100);