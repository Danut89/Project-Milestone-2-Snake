const gameboard = document.getElementById('gameboard');
const ctx = gameBoard.getContext("2d");
const tile = 10;
let direction = "left";

function draw() {
    ctx.clearRect(0,0,gameBoard.clientWidth, gameBoard.height) 
    ctx.fillStyle = "red";
    for (let i = 0; i < snake.length; i++) {
        ctx.fillRect(snake[i].x, snake[i].y, tile, tile);
    };

    let currentHeadX = snake[0].x;
    let currentHeadY = snake[0].y;

    if (direction === "up") {
        currentHeadY = currentHeadY - tile;
    } else if (direction === "down") {
        currentHeadY = currentHeadY + tile;
    } else if (direction === "left") {
        currentHeadX = currentHeadX - tile;
    } else if (direction === "right") {
        currentHeadX = currentHeadX + tile;
    }

    snake.pop(); // removes last object (tail end) in snake array
    let newHead = {
        x: currentHeadX,
        y: currentHeadY
    };
    snake.unshift(newHead);
};

setInterval(draw, 1000);

// Initial snake array
let snake = [];
snake[0] = { x: 19 * tile, y: 19 * tile };
snake[1] = { x: 20 * tile, y: 19 * tile };
snake[2] = { x: 21 * tile, y: 19 * tile };






