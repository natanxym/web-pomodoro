const timeElement = document.querySelector(".time");
const controlButton = document.querySelector(".timer-control");
const resetButton = document.querySelector(".reset-button");
const workTimeElement = document.querySelector("#work-time-options");
const turnElement = document.querySelector(".turns");
const totalTurnsElement = document.querySelector("#total-turns-options");
const timeModeElement = document.querySelector(".time-mode");
const notificationSound = document.querySelector("#notification");
const circleElement = document.querySelector(".circle");
const testMode = new URLSearchParams(location.search).has("teste");
const shortBreak = testMode ? 5 : 5 * 60;
const longbreak = testMode ? 8 : 15 * 60;
const workTest = 10;

controlButton.addEventListener("click", toggleStartPause);
resetButton.addEventListener("click", resetStage);

let timeRemaining = 0;
let timer = null;
let isRunning = false
let isBreakTime = false;
let workTime = 0;
let totalTurns = 0;
let currentTurn = 1;
let totalTime = 0;
let endTime = 0;
let shownTurn = 0;
let turnStarted = false;

document.getElementById("toggle-config").addEventListener("click", () => {
  const config = document.getElementById("drop-content");
  config.style.display = config.style.display === "none" || !config.style.display ? "flex" : "none";
});

function toggleStartPause() {
  isRunning ? pause() : start();
}

function resetStage() {
  pause();
  timeRemaining = totalTime;
  updateUI();
}

function applySettings() {
  pause();
  initTimerSettings();
  updateUI();
}

function initTimerSettings() {
  const workValue = parseInt(workTimeElement.value);
  const turnsValue = parseInt(totalTurnsElement.value);
  isRunning = false;
  isBreakTime = false;
  workTime = testMode ? workTest : workValue * 60;
  totalTurns = turnsValue;
  currentTurn = 0;
  shownTurn = 0;
  turnStarted = false; 
  totalTime = workTime;
  timeRemaining = totalTime;
  timer = null;
}

function updateTurnDisplay() {
  let mode = "Foco";
  if (isBreakTime) mode = currentTurn >= totalTurns ? "Pausa Longa" : "Pausa";

  timeModeElement.innerText = mode;
  turnElement.innerText = `${shownTurn}/${totalTurns}`;
}

function setCirclePercent(percent) {
  // 2*PI*R
  const circlePerimeter = 565.49;
  const dashOffset = circlePerimeter - (circlePerimeter * percent) / 100;
  circleElement.style.setProperty("--dash-offset", dashOffset);
}

function updateTimeDisplay() {
  const minutes = Math.floor(timeRemaining / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (timeRemaining % 60).toString().padStart(2, "0");
  timeElement.innerText = `${minutes}:${seconds}`;

  const percent = (timeRemaining / totalTime) * 100;
  setCirclePercent(percent);
}

function nextTurn() {
  if (!isBreakTime) {
    currentTurn++;
    isBreakTime = true;
    totalTime = currentTurn >= totalTurns ? longbreak : shortBreak;
    showNotification("Hora de descansar", "Parabéns pelo trabalho, aproveite para descansar!");
  } else if (currentTurn >= totalTurns) {
    currentTurn = 0;
    isBreakTime = false;
    totalTime = workTime;
    shownTurn = 0;
    turnStarted = false;
    showNotification("Novo ciclo", "Pausa longa concluída. Bora para o próximo ciclo!");
  } else {
    isBreakTime = false;
    totalTime = workTime;
    turnStarted = false;    // ← o próximo foco ainda não foi contado
    showNotification("Voltar ao trabalho", "Você está quase lá, só mais alguns minutos!");
  }

  timeRemaining = totalTime;
  pause();
  updateUI();
}

function showNotification(title, body) {
  if (Notification.permission === "granted") {
    const notification = new Notification(title, { body });
    setTimeout(() => notification.close(), 4000);
  }
}

function finishTurn() {
  notificationSound.play()
  nextTurn();
  updateUI();
}

function updateTimer() {
  timeRemaining = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
  updateTimeDisplay();

  if (timeRemaining === 0) {
    clearInterval(timer);
    timer = null;
    isRunning = false;
    finishTurn();
  }
}

function updateUI() {
  updateTimeDisplay();
  updateTurnDisplay();
}

function start() {
  if (isRunning) return;
  if (Notification.permission === "default") {
    Notification.requestPermission();
  }

  if (!isBreakTime && !turnStarted) {
    shownTurn++;
    turnStarted = true;
    updateTurnDisplay();
  }

  isRunning = true;
  endTime = Date.now() + timeRemaining * 1000;
  controlButton.innerText = "Pausar";
  timer = setInterval(updateTimer, 1000);
}

function pause() {
  if (isRunning) {
    timeRemaining = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
  }
  isRunning = false;
  clearInterval(timer);
  timer = null;
  controlButton.innerText = "Iniciar";
  updateTimeDisplay();
}

initTimerSettings();
pause();
updateUI();