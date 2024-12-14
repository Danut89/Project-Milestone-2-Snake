# Snacky Snake

A fun, interactive, and mobile-responsive Snake game built with JavaScript. This game offers a classic Snake experience with additional features such as sound effects, mobile touch controls, and smooth animations.

## Table of Contents

- [About](#about)
- [Features](#features)
- [Installation](#installation)
- [Gameplay](#gameplay)
- [Mobile Support](#mobile-support)
- [License](#license)

## About

Funny Snake is a modern take on the classic Snake game, designed to be both fun and challenging. It features smooth animations, responsive touch controls for mobile devices, and immersive sound effects. The game is built using HTML, CSS, and JavaScript, and is fully responsive to provide an optimal experience across all devices.

## Features

- **Classic Gameplay**: Navigate the snake to eat food, avoid hitting the walls or yourself.
- **Mobile Touch Controls**: Swipe to move the snake using HammerJS for mobile devices.
- **Sound Effects**: Background music and sound effects powered by HowlerJS to enhance the gaming experience.
- **Responsive Design**: Optimized for both desktop and mobile screens.
- **Animated Background**: A visually appealing animated background for added immersion.
- **Score Tracking**: Keep track of your high score to compete against yourself.

## Installation

To get started, clone the repository and open the `index.html` file in your browser.

### Steps:

1. Clone this repository:
   ```bash
   git clone https://github.com/your-username/cyber-snake.git


## 🐛 Bug Section

### 1. Bug: Missing Top Border When Walls Are Enabled
**Description:**  
When the "Walls" option was enabled, a yellow border was displayed around the game area to indicate the walls. However, the top border (directly beneath the score header) was missing, causing the wall to appear incomplete.

---

#### Steps to Reproduce:
1. Start the game and enable the "Walls" option in the options menu.
2. Observe the game board—yellow borders appear on the sides and bottom, but the top border under the score header is missing.

---

#### Cause:
The top border was not being drawn explicitly as part of the game canvas rendering. The border logic did not account for the area beneath the score header.

---

#### Resolution:
To resolve the issue:
1. Added a block in the `drawGame` function to explicitly draw a 3px border under the score header.
2. Dynamically updated the border color based on the "Walls" state:
   - Yellow (`#f9ca24`) when walls are enabled.
   - Dark gray (`#2C2C42`) when walls are disabled.

---

#### Relevant Code Snippet:
**Before Fixing:**
```javascript
gameCtx.fillStyle = "white";
gameCtx.font = "40px Verdana";
gameCtx.fillText(score, tileSize, tileSize * 2.25); // Draw the score
```

**After Fixing:**
```javascript
// Draw the 3px border under the header
if (wallsEnabled) {
    gameCtx.fillStyle = "#f9ca24"; // Yellow border for walls enabled
} else {
    gameCtx.fillStyle = "#2C2C42"; // Green neon background color for walls disabled
}
gameCtx.fillRect(0, tileSize * 3, gameCanvas.width, 3); // Draw the border
```

### 2. Bug: Food Overlapping Snake
**Description:**  
The food sometimes spawned on a segment of the snake’s body, making it impossible for the player to collect it. This resulted in a frustrating gameplay experience.

---

#### Steps to Reproduce:
1. Play the game until the snake grows larger.
2. Observe that food may occasionally spawn on top of the snake's body.

---

#### Cause:
The function responsible for generating the food position (`generateNewFood`) did not check if the generated position overlapped with the snake’s segments.

---

#### Resolution:
To fix this issue:
1. Added a **check for overlap** between the food position and the snake's body.
2. Used a `do...while` loop to ensure the food position is valid (not overlapping) before assigning it.

---

#### Relevant Code Snippet:
**Before Fixing:**
```javascript
function generateNewFood() {
    foodPosition = { 
        x: Math.floor(Math.random() * 20) * tileSize, 
        y: Math.floor(Math.random() * 20 + 3) * tileSize 
    };
    foodColor = colorArray[Math.floor(Math.random() * colorArray.length)];
}
```
**After Fixing:**
```javascript
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
```
## 3. Bug: Sparks Defaulting to White or Causing Errors

### Issue:
The sparks that appear when the snake eats food were either defaulting to white (when `foodColor` was `null`) or causing an error in the console. This issue occurred because the `foodColor` variable was initialized as `null` and was not assigned a valid value before `generateSparks` was called the first time.

### Error Message:
```plaintext
Uncaught TypeError: Cannot read properties of null (reading 'replace')
```

### Cause:
- `foodColor` was not properly assigned before the `generateSparks` function was called.
- The `generateSparks` function expected a valid color but received `null` on the first call.

---

### Fix: Adding a Fallback for `foodColor`

To ensure the sparks always have a valid color, i implemented two changes:
1. Added a fallback value for `foodColor` inside the `generateNewFood` function to guarantee it always has a default color.
2. Updated the `generateSparks` function to check for and handle `null` values with a fallback color (white).

---

### Before Code

#### 1. `generateNewFood` (No Fallback for `foodColor`):
```javascript
function generateNewFood() {
    let isOverlapping;

    do {
        foodPosition = { 
            x: Math.floor(Math.random() * 20) * tileSize, 
            y: Math.floor(Math.random() * 20 + 3) * tileSize 
        };

        isOverlapping = snake.some(segment => segment.x === foodPosition.x && segment.y === foodPosition.y);
    } while (isOverlapping);

    // Assign a random color to the food
    foodColor = colorArray[Math.floor(Math.random() * colorArray.length)];
}
```

#### 2. `generateSparks` (No Check for `null`):
```javascript
function generateSparks(x, y, color) {
    for (let i = 0; i < 30; i++) {
        const angle = Math.random() * 2 * Math.PI;
        const speed = randomNumber(1, 3);
        const dx = Math.cos(angle) * speed;
        const dy = Math.sin(angle) * speed;
        sparks.push(new Spark(x, y, dx, dy, color)); // Error if color is null
    }
}
```

---

### After Code

#### 1. `generateNewFood` (Added Fallback for `foodColor`):
```javascript
function generateNewFood() {
    let isOverlapping;

    do {
        foodPosition = { 
            x: Math.floor(Math.random() * 20) * tileSize, 
            y: Math.floor(Math.random() * 20 + 3) * tileSize 
        };

        isOverlapping = snake.some(segment => segment.x === foodPosition.x && segment.y === foodPosition.y);
    } while (isOverlapping);

    // Ensure foodColor is always valid
    foodColor = colorArray[Math.floor(Math.random() * colorArray.length)] || "rgba(255, 255, 255, 1)";
}
```

#### 2. `generateSparks` (Added Fallback for `color`):
```javascript
function generateSparks(x, y, color) {
    if (!color) {
        color = "rgba(255, 255, 255, 1)"; // Default to white
    }
    for (let i = 0; i < 30; i++) {
        const angle = Math.random() * 2 * Math.PI;
        const speed = randomNumber(1, 3);
        const dx = Math.cos(angle) * speed;
        const dy = Math.sin(angle) * speed;
        sparks.push(new Spark(x, y, dx, dy, color));
    }
}
```

---

### Results

- **First Food:** Sparks default to white on the first food eaten (since `foodColor` is `null` at the beginning).
- **Subsequent Foods:** Sparks correctly match the color of the food eaten.
- **No Errors:** The error (`Cannot read properties of null`) is no longer thrown in the console.

---

### Conclusion

This fix ensures that the sparks always have a valid color, even in edge cases. The game now provides a consistent visual effect when the snake eats food, enhancing the user experience.

