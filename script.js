import { quotes } from './modules/quotes.js';
import {
  saveHighScore,
  displayHighScores,
  clearHighScores,
} from './modules/highscores.js';

// Initialize variables to store the list of words and track the player's position
let words = [];
let wordIndex = 0;
let startTime = Date.now();
let timerInterval;

// Page elements
const quotesDiv = document.querySelector('.quotes');
const quoteElement = document.getElementById('quote');
const typedValueElement = document.getElementById('typed-value');
const promptStart = document.getElementById('prompt_start');
const promptAgain = document.getElementById('prompt_again');
const startButton = document.getElementById('start');
const timerElement = document.getElementById('timer');
const welcome = document.getElementById('welcome');
const resetBtn = document.getElementById('reset');
const resetDiv = document.getElementById('reset-div');
const formShow = document.getElementsByClassName('form');

const hidePrompt_Button = () => {
  promptAgain.classList.add('none');
  promptStart.className = 'none';
  startButton.style.visibility = 'hidden';
  welcome.style.display = 'none';
  resetDiv.style.display = 'none';
};

const showPrompt_Button = () => {
  promptAgain.classList.remove('none');
  startButton.style.visibility = 'visible';
  resetDiv.style.display = 'inline-block';
};

const showForm = () => {
  formShow[0].style.display = 'flex';
};

const hideForm = () => {
  formShow[0].style.display = 'none';
};

const showTimer = () => {
  timerElement.classList.remove('none');
  timerElement.style.display = 'inline-block';
  timerElement.innerText = '0';
};

const startTimer = () => {
  startTime = new Date().getTime();
  timerInterval = setInterval(() => {
    const elapsedTime = ((new Date().getTime() - startTime) / 1000).toFixed(0);
    timerElement.innerText = `${elapsedTime}`;
  }, 1000);
};

const stopTimer = () => {
  clearInterval(timerInterval);
};

typedValueElement.disabled = true;
typedValueElement.setAttribute('autocomplete', 'off');

typedValueElement.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
  }
});

let isTimerStarted = false;

resetBtn.addEventListener('click', () => {
  const userConfirmed = confirm(
    'Are you sure you want to reset all high scores? This action cannot be undone.'
  );

  if (userConfirmed) {
    clearHighScores();
    alert('High scores have been successfully reset.');
  }
});

startButton.addEventListener('click', () => {
  resetDiv.style.display = 'none';

  const quoteIndex = Math.floor(Math.random() * quotes.length);
  let quote = quotes[quoteIndex];

  words = quote.split(' ');
  wordIndex = 0;

  const spanWords = words.map((word) => `<span> ${word} </span>`);

  showTimer();
  hidePrompt_Button();
  showForm();

  // Push the quote element up
  quotesDiv.classList.add('active');

  quoteElement.innerHTML = spanWords.join('');
  quoteElement.classList.add('quote');
  quoteElement.childNodes[0].className = 'highlight';

  isTimerStarted = false;
  typedValueElement.value = '';
  typedValueElement.disabled = false;
  typedValueElement.focus();
});

let errorFlag = false;

typedValueElement.addEventListener('input', () => {
  if (!isTimerStarted) {
    startTimer();
    isTimerStarted = true;
  }
  const typedValue = typedValueElement.value;
  const currentWord = words[wordIndex];
  const typedWords = typedValue.trim().split(' ');
  const currentTypedWord = typedWords[typedWords.length - 1] || '';

  if (typedValue.endsWith(' ') && currentTypedWord !== currentWord) {
    typedValueElement.className = 'error';
    errorFlag = true;
  } else if (typedValue.length < currentTypedWord.length) {
    typedValueElement.className = 'error';
    errorFlag = true;
  } else if (currentWord.startsWith(currentTypedWord)) {
    typedValueElement.className = '';
    errorFlag = false;

    // Check if the current word is correct and fully typed
    if (typedWords[wordIndex] === currentWord) {
      if (wordIndex === words.length - 1) {
        stopTimer();
        const elapsedTime = ((new Date().getTime() - startTime) / 1000).toFixed(
          2
        );
        const message = ` 🎉CONGRATULATIONS! You finished in ${elapsedTime} seconds.`;

        const isTopScore = saveHighScore(elapsedTime);
        const highScoreMessage = displayHighScores(
          null,
          isTopScore ? elapsedTime : null
        ); // Get high scores as string

        // Show alert with message and high scores
        alert(message + '\n' + highScoreMessage);

        typedValueElement.disabled = true;
        showPrompt_Button();
        hideForm();
        quotesDiv.classList.remove('active');
        
      } else if (typedValue.endsWith(' ')) {
        wordIndex++;
        const completedText = words.slice(0, wordIndex).join(' ') + ' ';
        typedValueElement.value = completedText;

        for (const wordElement of quoteElement.children) {
          wordElement.className = '';
        }
        quoteElement.children[wordIndex].className = 'highlight';
      }
    }
  } else {
    typedValueElement.className = 'error';
    errorFlag = true;
  }
});
