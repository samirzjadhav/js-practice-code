const play = document.getElementById("play");
const message = document.getElementById("message");
const sub = document.getElementById("sub");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const resetBtn = document.getElementById("resetBtn");
const strict = document.getElementById("strict");
const resultsList = document.getElementById("resultsList");
const downloadBtn = document.getElementById("downloadBtn");
const clearBtn = document.getElementById("clearBtn");

let state = "idle"; // idle | waiting | ready | done
let waitTimer = null;
let startTime = 0;
let reaction = null;
let results = JSON.parse(localStorage.getItem("rsg_results") || "[]");

function saveResults() {
  localStorage.setItem("rsg_results", JSON.stringify(results));
}

function updateStats() {
  const best = results.length ? Math.min(...results.map((r) => r.time)) : null;
  const avg = results.length
    ? Math.round(results.reduce((s, r) => s + r.time, 0) / results.length)
    : null;
  sub.textContent = `Best: ${best !== null ? best + " ms" : "—"} · Avg: ${
    avg !== null ? avg + " ms" : "—"
  }`;

  resultsList.innerHTML = "";
  results
    .slice()
    .reverse()
    .forEach((r, i) => {
      const el = document.createElement("div");
      el.className = "result-item";
      el.textContent =
        `${r.time} ms — ${new Date(r.at).toLocaleString()}` +
        (r.falseStart ? " (false start)" : "");
      resultsList.appendChild(el);
    });
}

function randDelay() {
  return 1000 + Math.floor(Math.random() * 2500);
} // 1s - 3.5s

function startWaiting() {
  if (state === "waiting") return;
  state = "waiting";
  message.textContent = "Wait for green...";
  play.style.background = "#5a3d3d";
  // choose random delay
  const delay = randDelay();
  clearTimeout(waitTimer);
  waitTimer = setTimeout(() => {
    state = "ready";
    startTime = performance.now();
    play.style.background = "#1a8f4a";
    message.textContent = "CLICK!";
  }, delay);
}

function stopWaiting(early) {
  clearTimeout(waitTimer);
  if (early) {
    state = "idle";
    play.style.background = "#2b3b4a";
    message.textContent = "Too soon!";
    // penalty or record false start
    const entry = { time: 9999, at: Date.now(), falseStart: true };
    if (strict.checked) results.push(entry);
    saveResults();
    updateStats();
    return;
  }
  if (state === "ready") {
    const end = performance.now();
    reaction = Math.round(end - startTime);
    message.textContent = reaction + " ms";
    play.style.background = "#18334a";
    results.push({ time: reaction, at: Date.now(), falseStart: false });
    if (results.length > 50) results.shift();
    saveResults();
    updateStats();
    state = "done";
  }
}

// click / tap handler
function handleClick() {
  if (state === "idle") {
    startWaiting();
  } else if (state === "waiting") {
    // early click
    stopWaiting(true);
  } else if (state === "ready") {
    stopWaiting(false);
  } else if (state === "done") {
    startWaiting();
  }
}

play.addEventListener("click", handleClick);
play.addEventListener("touchstart", (e) => {
  e.preventDefault();
  handleClick();
});

startBtn.addEventListener("click", () => {
  if (state === "waiting" || state === "ready") return;
  startWaiting();
});

stopBtn.addEventListener("click", () => {
  clearTimeout(waitTimer);
  state = "idle";
  message.textContent = "Stopped";
  play.style.background = "#18334a";
});

resetBtn.addEventListener("click", () => {
  clearTimeout(waitTimer);
  state = "idle";
  message.textContent = "Press Start";
  play.style.background = "#18334a";
});

clearBtn.addEventListener("click", () => {
  if (!confirm("Clear all saved results?")) return;
  results = [];
  saveResults();
  updateStats();
});

downloadBtn.addEventListener("click", () => {
  if (!results.length) return alert("No results to download");
  const header = "time_ms,timestamp,iso_date,false_start\n";
  const body = results
    .map(
      (r) =>
        `${r.time},${r.at},"${new Date(r.at).toISOString()}",${
          r.falseStart ? 1 : 0
        }`
    )
    .join("\n");
  const blob = new Blob([header + body], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "reaction_results.csv";
  a.click();
  URL.revokeObjectURL(url);
});

// keyboard shortcuts
window.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault();
    if (state === "idle" || state === "done") startWaiting();
    else if (state === "waiting" || state === "ready")
      stopWaiting(state === "waiting");
  }
  if (e.key.toLowerCase() === "c") {
    results = [];
    saveResults();
    updateStats();
  }
});

// initialize
updateStats();
// visual initial state
play.style.background = "#18334a";
message.textContent = "Press Start";
