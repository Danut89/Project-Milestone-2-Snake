const gameBoard = document.getElementById('gameBoard');
gameBoard.width = 400;
gameBoard.height = 400;
const ctx = gameBoard.getContext("2d");
const tile = 20;

// Initial gamestate

// Initial snake array
let snake = [];
snake[0] = { x: 19 * tile, y: 19 * tile };
snake[1] = { x: 20 * tile, y: 19 * tile };
snake[2] = { x: 21 * tile, y: 19 * tile };


function Random() {
    return Math.floor(Math.random() * 20) * tile;
}


let food = {
    x: Random(),
    y: Math.floor(Math.random() * 20 + 3) * tile
}

let score = 0;
let direction = "left";
let gameSpeed = 125;
let lastKey = 0;
let safeDelay = 130; // Delay to prevent snake from eating itself on quick key presses


// Control snake direction with keyboard arrows
document.addEventListener("keydown", function (event) {
    if (Date.now() - lastKey > safeDelay) {
        if (event.keyCode == 38 && direction !== "down") {
            direction = "up";
        } else if (event.keyCode == 40 && direction !== "up") {
            direction = "down";
        } else if (event.keyCode == 37 && direction !== "right") {
            direction = "left";
        } else if (event.keyCode == 39 && direction !== "left") {
            direction = "right";
        }
        lastKey = Date.now();
    }
});


// Active gamestate

function draw() {
    ctx.clearRect(0,0,gameBoard.clientWidth, gameBoard.height)  // Clear the gameboard

    //Draw the score background
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, gameBoard.clientWidth, tile * 3);

    //Draw the score
    ctx.fillStyle = "white";
    ctx.font = "40px Verdana";
    ctx.fillText(score, tile, tile * 2.25);

     // Draw the food
    ctx.beginPath();
    ctx.arc(food.x + (tile - 3) / 2, food.y + (tile - 3) / 2, tile / 2, 0, 2 * Math.PI, false);
    ctx.strokeStyle = "green";
    ctx.stroke();
    ctx.fillStyle = "blue";
    ctx.fill();

    // Draw the snake
    ctx.fillStyle = 'red';
    for (let i = 0; i < snake.length; i++) {
        ctx.fillRect(snake[i].x, snake[i].y, tile, tile);
    }

    // Get current head position
    let currentHeadX = snake[0].x;
    let currentHeadY = snake[0].y;

    // Update head position based on direction
    if (direction === "up") {
        currentHeadY -= tile;
    } else if (direction === "down") {
        currentHeadY += tile;
    } else if (direction === "left") {
        currentHeadX -= tile;
    } else if (direction === "right") {
        currentHeadX += tile;
    }

     let newHead = { x: currentHeadX, y: currentHeadY };


    // Check if snake eats food
    if (newHead.x === food.x && newHead.y === food.y) {
        food = { 
             x: Math.floor(Math.random() * 20) * tile,             // Generate new food at random position
             y: Math.floor(Math.random() * 20 + 3) * tile 
              };
        snake.unshift(newHead);
        score++;
    } else {
        snake.unshift(newHead);
        snake.pop();                      // removes last object in snake array
    }

    // if food spawns inside snake array, spawns new food
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === food.x && snake[i].y === food.y) {
            console.log("GET NEW FOOD");
            food = {
            x: Random(),
            y: Random()
            };
        }; 
    };

    // Detect collision with self
    for (let i = 1; i < snake.length; i++) {
        if (newHead.x === snake[i].x && newHead.y === snake[i].y) {
            console.log("ATE SELF");
            clearInterval(game);
        }; 
    };

    // Detects whether newHead has coordinates outside of gameBoard. Stops game if true
    if (newHead.x > gameBoard.width - tile || newHead.x < 0 || newHead.y > gameBoard.height - tile || newHead.y < 3 * tile) {
        clearInterval(game);
      };
};


let game = setInterval(draw, 200);