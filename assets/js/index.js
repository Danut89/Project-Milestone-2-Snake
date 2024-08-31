
//Initial snake empty array
let snake = [];
snake[0] = { x: 0, y: 0 };
snake[1] = { x: 1, y: 0 };
snake[2] = { x: 2, y: 0 };

// Current snake head coordinates
let currentHeadX = snake[0].x;
let currentHeadY = snake[0].y;

let direction;

let moveSnake = function() {
    if (direction === "up") {
        snake.pop();
        snake.unshift({x: currentHeadX, y: --currentHeadY});
    } else if (direction === "down") {
        snake.pop();
        snake.unshift({x: currentHeadX, y: ++currentHeadY});
    } else if (direction === "left") {
        snake.pop();
        snake.unshift({x: --currentHeadX, y: currentHeadY});
    } else if (direction === "right") {
        snake.pop();
        snake.unshift({x: ++currentHeadX, y: currentHeadY});
    }
    check();
}

let check = function() {
    for (let i = 0; i < snake.length; i++) {
        console.log(`x: ${snake[i].x} y: ${snake[i].y}`);
    }
}
