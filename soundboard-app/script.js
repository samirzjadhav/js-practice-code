const NUM_PADS = 8; // adjustable
const padsEl = document.getElementById("pads");
const filePicker = document.getElementById("filePicker");
const stopAllBtn = document.getElementById("stopAll");
const clearAllBtn = document.getElementById("clearAll");
const saveCfgBtn = document.getElementById("saveCfg");
const loadCfgBtn = document.getElementById("loadCfg");
const exportCfgBtn = document.getElementById("exportCfg");
const volumeRange = document.getElementById("volume");
const toneSine = document.getElementById("toneSine");
const toneSquare = document.getElementById("toneSquare");
const toneNoise = document.getElementById("toneNoise");

const AudioContextClass = window.AudioContext || window.webkitAudioContext;
const audioCtx = AudioContextClass ? new AudioContextClass() : null;

const pads = [];

// Utility: create pad UI
for (let i = 0; i < NUM_PADS; i++) {
  const pad = document.createElement("div");
  pad.className = "pad";
  pad.innerHTML = `<strong>Pad ${
    i + 1
  }</strong><div class="small muted" style="margin-top:6px">Key: <span data-key>-</span></div>
        <div style="margin-top:8px;display:flex;gap:6px;width:100%">
          <button data-action="assign">Assign</button>
          <button data-action="play">Play</button>
        </div>`;
  padsEl.appendChild(pad);

  const obj = {
    el: pad,
    index: i,
    key: null,
    buffer: null,
    audio: null,
    isPlaying: false,
    filename: null,
  };
  pads.push(obj);
}

// Render/Refresh pad labels
function refreshPads() {
  pads.forEach((p) => {
    p.el.querySelector("strong").textContent = p.filename
      ? p.filename
      : `Pad ${p.index + 1}`;
    p.el.querySelector("[data-key]").textContent = p.key
      ? p.key.toUpperCase()
      : "-";
  });
}

// Play a pad
function playPad(p) {
  if (audioCtx) {
    if (p.buffer) {
      const src = audioCtx.createBufferSource();
      src.buffer = p.buffer;
      const gain = audioCtx.createGain();
      gain.gain.value = Number(volumeRange.value || 1);
      src.connect(gain).connect(audioCtx.destination);
      src.onended = () => {
        p.isPlaying = false;
      };
      src.start();
      p.currentSource = src;
      p.isPlaying = true;
    } else if (p.audio) {
      p.audio.volume = Number(volumeRange.value || 1);
      p.audio.currentTime = 0;
      p.audio.play();
      p.isPlaying = true;
    }
  } else {
    // fallback
    if (p.audio) {
      p.audio.volume = Number(volumeRange.value || 1);
      p.audio.currentTime = 0;
      p.audio.play();
      p.isPlaying = true;
    }
  }
}

function stopPad(p) {
  if (audioCtx && p.currentSource) {
    try {
      p.currentSource.stop();
    } catch (e) {}
    p.currentSource = null;
  }
  if (p.audio) {
    try {
      p.audio.pause();
      p.audio.currentTime = 0;
    } catch (e) {}
  }
  p.isPlaying = false;
}

// Assign button / play button handlers
pads.forEach((p) => {
  p.el.addEventListener("click", (e) => {
    const action = e.target.getAttribute("data-action");
    if (action === "assign") {
      // open file picker and load
      filePicker.onchange = async (evt) => {
        const file = evt.target.files && evt.target.files[0];
        if (!file) return;
        p.filename = file.name.replace(/\.[^/.]+$/, "");
        const array = await file.arrayBuffer();
        if (audioCtx) {
          try {
            p.buffer = await audioCtx.decodeAudioData(array.slice(0));
            p.audio = null;
          } catch (e) {
            // decoding failed, fallback
            p.buffer = null;
            p.audio = new Audio(URL.createObjectURL(file));
          }
        } else {
          p.buffer = null;
          p.audio = new Audio(URL.createObjectURL(file));
        }
        refreshPads();
        filePicker.value = "";
      };
      filePicker.click();
    } else if (action === "play") {
      // play
      if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
      playPad(p);
    }
  });

  // also double-click to set keyboard key
  p.el.addEventListener("dblclick", () => {
    const key = prompt(
      "Press a single key to assign (e.g. A, 1, q). Leave empty to unassign."
    );
    if (key === null) return;
    const val = key.trim().charAt(0) || null;
    p.key = val ? val.toLowerCase() : null;
    refreshPads();
    saveConfigToLocal();
  });

  // single click on pad plays (on pad area)
  p.el.addEventListener("click", (e) => {
    if (e.target.closest("button")) return; // ignore if clicked a control button
    if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
    playPad(p);
  });
});

// sample tone generators using WebAudio
function playTone(type = "sine", duration = 0.5) {
  if (!audioCtx) return alert("AudioContext not supported in this browser");
  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  o.type = type;
  o.frequency.value = 440;
  g.gain.value = Number(volumeRange.value) || 1;
  o.connect(g).connect(audioCtx.destination);
  o.start();
  o.stop(audioCtx.currentTime + duration);
}

toneSine.addEventListener("click", () => playTone("sine"));
toneSquare.addEventListener("click", () => playTone("square"));
toneNoise.addEventListener("click", () => {
  if (!audioCtx) return;
  const buf = audioCtx.createBuffer(
    1,
    audioCtx.sampleRate * 0.3,
    audioCtx.sampleRate
  );
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.4;
  const src = audioCtx.createBufferSource();
  src.buffer = buf;
  const g = audioCtx.createGain();
  g.gain.value = Number(volumeRange.value) || 1;
  src.connect(g).connect(audioCtx.destination);
  src.start();
});

// keyboard handling
window.addEventListener("keydown", (e) => {
  const key = e.key.toLowerCase();
  // prevent using input fields elsewhere
  if (
    ["input", "textarea"].includes(document.activeElement.tagName.toLowerCase())
  )
    return;
  pads.forEach((p) => {
    if (p.key === key) {
      if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
      playPad(p);
    }
  });
  if (e.key === " ") {
    // space stops all
    e.preventDefault();
    stopAll();
  }
});

function stopAll() {
  pads.forEach(stopPad);
}

stopAllBtn.addEventListener("click", stopAll);
clearAllBtn.addEventListener("click", () => {
  if (!confirm("Clear all pads? This removes assigned sounds and keys."))
    return;
  pads.forEach((p) => {
    p.buffer = null;
    if (p.audio) {
      try {
        p.audio.pause();
      } catch (e) {}
      p.audio = null;
    }
    p.filename = null;
    p.key = null;
  });
  refreshPads();
  saveConfigToLocal();
});

// Save / Load config
function saveConfigToLocal() {
  // store only metadata (no audio buffers) — we persist file names and keys but not binary.
  const cfg = pads.map((p) => ({ filename: p.filename, key: p.key }));
  localStorage.setItem("sb_config", JSON.stringify(cfg));
  localStorage.setItem("sb_volume", volumeRange.value);
}

function loadConfigFromLocal() {
  const cfg = JSON.parse(localStorage.getItem("sb_config") || "null");
  if (!cfg) return;
  cfg.forEach((c, i) => {
    pads[i].filename = c.filename || null;
    pads[i].key = c.key || null;
  });
  const vol = localStorage.getItem("sb_volume");
  if (vol) volumeRange.value = vol;
  refreshPads();
}

saveCfgBtn.addEventListener("click", () => {
  saveConfigToLocal();
  alert("Config saved locally");
});
loadCfgBtn.addEventListener("click", () => {
  loadConfigFromLocal();
  alert("Config loaded (files must be assigned again in this session).");
});

exportCfgBtn.addEventListener("click", () => {
  const cfg = pads.map((p) => ({ filename: p.filename, key: p.key }));
  const blob = new Blob(
    [JSON.stringify({ pads: cfg, volume: volumeRange.value }, null, 2)],
    { type: "application/json" }
  );
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "soundboard-config.json";
  a.click();
  URL.revokeObjectURL(url);
});

function saveConfigToLocalOnChange() {
  saveConfigToLocal();
}
volumeRange.addEventListener("input", () => {
  saveConfigToLocalOnChange();
});
refreshPads();
loadConfigFromLocal();
