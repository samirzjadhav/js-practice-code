const quotes = [
  "The quick brown fox jumps over the lazy dog.",
  "Coding is like humor. When you have to explain it, it’s bad.",
  "First, solve the problem. Then, write the code.",
  "Experience is the name everyone gives to their mistakes.",
  "Code is like love; it demands time and attention.",
];

const quoteEl = document.getElementById("quote");
const inputEl = document.getElementById("input");
const timeEl = document.getElementById("time");
const wpmEl = document.getElementById("wpm");
const accuracyEl = document.getElementById("accuracy");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");

let startTime,
  timer,
  currentQuote,
  correctChars = 0;

function newQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  currentQuote = quotes[randomIndex];
  quoteEl.innerHTML = "";
  currentQuote.split("").forEach((char) => {
    const span = document.createElement("span");
    span.textContent = char;
    quoteEl.appendChild(span);
  });
}

function startTest() {
  inputEl.value = "";
  inputEl.disabled = false;
  inputEl.focus();
  correctChars = 0;
  timeEl.textContent = "0";
  wpmEl.textContent = "0";
  accuracyEl.textContent = "0";
  newQuote();
  startTime = Date.now();

  timer = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    timeEl.textContent = elapsed;
    calculateSpeed();
  }, 1000);
}

function calculateSpeed() {
  const elapsedMinutes = (Date.now() - startTime) / 60000;
  const wordsTyped = inputEl.value.trim().split(/\s+/).length;
  const wpm = Math.round(wordsTyped / elapsedMinutes) || 0;
  wpmEl.textContent = wpm;
}

inputEl.addEventListener("input", () => {
  const input = inputEl.value.split("");
  const spans = quoteEl.querySelectorAll("span");
  correctChars = 0;

  spans.forEach((span, index) => {
    const char = input[index];
    if (char == null) {
      span.classList.remove("correct", "incorrect");
    } else if (char === span.textContent) {
      span.classList.add("correct");
      span.classList.remove("incorrect");
      correctChars++;
    } else {
      span.classList.add("incorrect");
      span.classList.remove("correct");
    }
  });

  const accuracy = Math.round((correctChars / currentQuote.length) * 100);
  accuracyEl.textContent = isNaN(accuracy) ? 0 : accuracy;

  if (input.length === currentQuote.length) endTest();
});

function endTest() {
  clearInterval(timer);
  inputEl.disabled = true;
}

startBtn.addEventListener("click", () => {
  clearInterval(timer);
  startTest();
});

resetBtn.addEventListener("click", () => {
  clearInterval(timer);
  inputEl.value = "";
  inputEl.disabled = true;
  quoteEl.textContent = "Press Start to begin!";
  timeEl.textContent = "0";
  wpmEl.textContent = "0";
  accuracyEl.textContent = "0";
});

window.onload = () => {
  quoteEl.textContent = "Press Start to begin!";
};
