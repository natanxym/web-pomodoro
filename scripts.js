const timeElement = document.querySelector(".time");
const controlButton = document.querySelector(".timerControl");
const resetButton = document.querySelector(".resetButton");

controlButton.addEventListener("click", toggleStartPause);
resetButton.addEventListener("click", reset);

let timeRemaining = 0;
let timer = null;
let isRunning = false

function toggleStartPause() {
  isRunning ? pause() : start();
}

function reset() {
  pause();
  initTimerSettings();
  updateTimeDisplay();
}

function initTimerSettings() {
  timeRemaining = 25 * 60;
  timer = null;
}

function updateTimeDisplay() {
  const minutes = Math.floor(timeRemaining / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (timeRemaining % 60).toString().padStart(2, "0");
  timeElement.innerText = `${minutes}:${seconds}`;
}

function updateTimer() {
  if (timeRemaining > 0) {
    timeRemaining--;
    updateTimeDisplay()
  }
}

function start() {
  isRunning = true
  controlButton.innerText = "Pausar";
  timer = setInterval(updateTimer, 1000);
}

function pause() {
  isRunning = false;
  controlButton.innerText = "Iniciar";
  clearInterval(timer);
}

initTimerSettings();
start();