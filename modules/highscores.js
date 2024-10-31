// Function to display high scores
export function displayHighScores() {
  const highScores = getHighScores();

  // Prepare the high scores for alert box display
  const formattedScores = highScores
    .map((score, index) => `${index + 1}. ${score} seconds`)
    .join('\n');

  // Return the formatted scores string (if needed for further processing)
  return formattedScores;
}

// Function to save a new high score
export function saveHighScore(score) {
  let highScores = getHighScores();
  highScores.push(score);
  highScores.sort((a, b) => a - b); // Sort scores in ascending order
  if (highScores.length > 10) {
    highScores = highScores.slice(0, 10); // Keep only the top 10 scores
  }
  localStorage.setItem('highScores', JSON.stringify(highScores));
  return highScores.includes(score); // Return true if the score is in the top 10
}

// Function to retrieve high scores from local storage
export function getHighScores() {
  const highScores = localStorage.getItem('highScores');
  return highScores ? JSON.parse(highScores) : [];
}

// Function to clear high scores from local storage
export function clearHighScores() {
  localStorage.removeItem('highScores');
}
