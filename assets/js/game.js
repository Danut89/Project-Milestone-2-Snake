const gameBoard = document.getElementById('gameBoard');
const ctx = gameBoard.getContext("2d");
const tile = 10;

// Initial gamestate

// Initial snake array
let snake = [];
snake[0] = { x: 19 * tile, y: 19 * tile };
snake[1] = { x: 20 * tile, y: 19 * tile };
snake[2] = { x: 21 * tile, y: 19 * tile };


function Random() {
    return Math.floor(Math.random() * 41) * tile;
}


let food = {
     x: Random(),
    y: Random()
}

let score = 0;

let direction = "left";

document.addEventListener("keydown", keyDownHandler);

// Control snake direction with keyboard arrows
function keyDownHandler(event) {
    if(event.keyCode == 38 && direction != "down") {
        direction = "up"
    } else if (event.keyCode == 40 && direction != "up") {
        direction = "down"
    } else if (event.keyCode == 37 && direction != "right") {
        direction = "left"
    } else if (event.keyCode == 39 && direction != "left") {
        direction = "right"
    };
}



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

     // Draw the score
    ctx.fillStyle = "grey";
    ctx.font = "50px Verdana";
    ctx.fillText(score, 2 * tile, 5 * tile);

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
        food = { x: Random(),             // Generate new food at random position
             y: Random() 
            };
        snake.unshift(newHead);
        score++;
        console.log(`Score: ${score}`);
        console.log('Eat food');
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

    // Detects whether newHead has coordinates outside of gameBoard (x). Stops game if true
    if (newHead.x > gameBoard.width - tile || newHead.x < 0) {
        console.log("HIT X WALL");
        clearInterval(game);
        
    // Detects whether newHead has coordinates outside of gameBoard (y). Stops game if true
    } else if (newHead.y > gameBoard.height - tile || newHead.y < 0) {
        console.log("HIT Y WALL");
        clearInterval(game);
    }
};


let game = setInterval(draw, 200);