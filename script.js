import { quotes } from './modules/quotes.js';  
import {  
  saveHighScore,  
  displayHighScores,  
  clearHighScores,  
} from './modules/highscores.js';  

// Selected HTML elements  
const quoteElement = document.getElementById('quote');  
const typedValueElement = document.getElementById('typed-value');  
const promptStart = document.getElementById('prompt_start');  
const promptAgain = document.getElementById('prompt_again');  
const startButton = document.getElementById('start');  
const timerElement = document.getElementById('timer');  
const welcome = document.getElementById('welcome');  
const resetBtn = document.getElementById('reset');  
const resetDiv = document.getElementById('reset-div');  
const form = document.getElementsByClassName('form');  
const quotesDiv = document.querySelector('.quotes');  

// Hide prompt and related elements  
const hidePrompt_Button = () => {  
  promptStart.className = 'none';  
  promptAgain.classList.add('none');  
  startButton.style.visibility = 'hidden';  
  welcome.style.display = 'none';  
  resetDiv.style.display = 'none';  
};  

// Show prompt and related elements  
const showPrompt_Button = () => {  
  promptAgain.classList.remove('none');  
  startButton.style.visibility = 'visible';  
  resetDiv.style.display = 'inline-block';  
};  

// Show the form element  
const showForm = () => {  
  form[0].style.display = 'block';  
  quotesDiv.classList.add('active');  
};  

// Hide the form  
const hideForm = () => {  
  form[0].style.display = 'none';  
  quotesDiv.classList.remove('active');  
};  

// Show the timer  
const showTimer = () => {  
  timerElement.classList.remove('none');  
  timerElement.style.display = 'inline-block';  
  timerElement.innerText = '0';  
  typedValueElement.disabled = true;  
  typedValueElement.setAttribute('autocomplete', 'off');  
  typedValueElement.setAttribute('autocorrect', 'off');  
};  

let startTime = Date.now();  
let timerInterval = 0;  

// Start the timer  
const startTimer = () => {  
  startTime = Date.now();  
  timerInterval = setInterval(() => {  
    const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(0);  
    timerElement.innerText = `${elapsedTime}`;  
  }, 1000);  
};  

// Stop the timer  
const stopTimer = () => {  
  clearInterval(timerInterval);  
};  

let words = [];  
let wordIndex = 0;  
let isTimerStarted = false;  

// Start Button event listenr
startButton.addEventListener('click', () => {  
  hidePrompt_Button();  
  const quoteIndex = Math.floor(Math.random() * quotes.length);  
  let quote = quotes[quoteIndex];  
  words = quote.split(' ');  
  wordIndex = 0;  

  const spanWords = words.map((word) => `<span> ${word} </span>`);  
  quoteElement.innerHTML = spanWords.join('');  
  quoteElement.classList.add('quote');  
  quoteElement.childNodes[0].className = 'highlight';  

  showTimer();  
  showForm();  
    
  isTimerStarted = false;  
  typedValueElement.value = '';  
  typedValueElement.disabled = false;  
  typedValueElement.focus();  
});  

// Event listener for start button  
startButton.addEventListener('click', () => {  
  // Style the quote element  
  quoteElement.childNodes[0].className = 'highlight';  

  showTimer();  
  showForm();  

  isTimerStarted = false;  
  typedValueElement.value = '';  
  typedValueElement.disabled = false;  
  typedValueElement.focus();  
});  

// Validate the typed word  
function validateTypedWord(typedValue, currentWord, currentTypedWord) {  
  if (typedValue.endsWith(' ') && currentTypedWord !== currentWord) {  
    return false;  
  }  
  if (typedValue.length < currentTypedWord.length) {  
    return false;  
  }  
  return currentWord.startsWith(currentTypedWord);  
}  

// Highlight the currently typed word  
function highlightCurrentWord() {  
  for (const wordElement of quoteElement.children) {  
    wordElement.className = '';  
  }  
  quoteElement.children[wordIndex].className = 'highlight';  
}  

// Advance to the next word  
function advanceToNextWord() {  
  wordIndex++;  
  const completedText = words.slice(0, wordIndex).join(' ') + ' ';  
  typedValueElement.value = completedText;  

  highlightCurrentWord();  
}  

// Handle game completion  
function endGame() {  
  stopTimer();  
  showPrompt_Button();  
  hideForm();  
  typedValueElement.disabled = true;  
  quoteElement.innerHTML = '';  

  const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);  
  const message = `🎉CONGRATULATIONS! You finished in ${elapsedTime} seconds.`;  

  const isTopScore = saveHighScore(elapsedTime);  
  const highScoreMessage = displayHighScores(null, isTopScore ? elapsedTime : null);  

  alert(message + '\n' + highScoreMessage);  
}  

// Track input errors  
let errorFlag = false;  

// Event listener for input on the typed value element  
typedValueElement.addEventListener('input', () => {  
  if (!isTimerStarted) {  
    startTimer();  
    isTimerStarted = true;  
  }  

  const typedValue = typedValueElement.value;  
  const currentWord = words[wordIndex];  
  const typedWords = typedValue.trim().split(' ');  
  const currentTypedWord = typedWords[typedWords.length - 1] || '';  

  if (validateTypedWord(typedValue, currentWord, currentTypedWord)) {  
    typedValueElement.className = '';  
    errorFlag = false;  

    if (currentTypedWord === currentWord) {  
      if (wordIndex === words.length - 1) {  
        endGame();  
      } else if (typedValue.endsWith(' ')) {  
        advanceToNextWord();  
      }  
    }  
  } else {  
    typedValueElement.className = 'error';  
    errorFlag = true;  
  }  
});  

// Prevent default action on Enter key press  
typedValueElement.addEventListener('keydown', (event) => {  
  if (event.key === 'Enter') {  
    event.preventDefault();  
  }  
});  

// Event listener for reset button  
resetBtn.addEventListener('click', () => {  
  const userConfirmed = confirm('Are you sure you want to reset all high scores? This action cannot be undone.');  

  if (userConfirmed) {  
    clearHighScores();  
    alert('High scores have been successfully reset.');  
  }  
});  