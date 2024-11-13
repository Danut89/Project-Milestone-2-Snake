// Number of high scores to keep
const MAX_HIGH_SCORES = 5;

// Retrieve high scores from localStorage
function getHighScores() {
    const highScores = JSON.parse(localStorage.getItem("highScores")) || [];
    return highScores;
}

// Save a new score to the high scores list
function saveHighScore(score) {
    const highScores = getHighScores();

    // Add new score and sort the list
    highScores.push(score);
    highScores.sort((a, b) => b - a);

    // Keep only the top MAX_HIGH_SCORES scores
    if (highScores.length > MAX_HIGH_SCORES) {
        highScores.pop();
    }

    // Save back to localStorage
    localStorage.setItem("highScores", JSON.stringify(highScores));
}

// Display high scores in the Scores menu
function displayHighScores() {
    const highScores = getHighScores();
    const scoreList = document.getElementById("score-list");

    // Clear existing scores
    scoreList.innerHTML = "";

    // Populate the score list with high scores
    highScores.forEach((score, index) => {
        const scoreItem = document.createElement("li");
        scoreItem.textContent = `#${index + 1}: ${score}`;
        scoreList.appendChild(scoreItem);
    });
}
