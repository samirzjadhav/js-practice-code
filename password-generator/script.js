// Password Generator JS
const output = document.getElementById("passwordOutput");
const lengthEl = document.getElementById("length");
const lengthLabel = document.getElementById("lengthLabel");
const upper = document.getElementById("upper");
const lower = document.getElementById("lower");
const numbers = document.getElementById("numbers");
const symbols = document.getElementById("symbols");
const generateBtn = document.getElementById("generate");
const copyBtn = document.getElementById("copyBtn");
const shuffleBtn = document.getElementById("shuffle");
const downloadBtn = document.getElementById("download");
const meter = document.getElementById("meter").querySelector("span");
const strengthText = document.getElementById("strengthText");
const avoidAmb = document.getElementById("avoidAmbiguous");

const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWER = "abcdefghijklmnopqrstuvwxyz";
const NUMS = "0123456789";
const SYMS = "!@#$%^&*()_+[]{}|;:,.<>?/~`-=";
const AMBIG = "O0l1I";

function buildCharset() {
  let set = "";
  if (upper.checked) set += UPPER;
  if (lower.checked) set += LOWER;
  if (numbers.checked) set += NUMS;
  if (symbols.checked) set += SYMS;
  if (avoidAmb.checked)
    set = set
      .split("")
      .filter((c) => !AMBIG.includes(c))
      .join("");
  return set;
}

function secureRandomInt(max) {
  // returns 0..max-1
  const arr = new Uint32Array(1);
  window.crypto.getRandomValues(arr);
  return arr[0] % max;
}

function generate() {
  const len = Number(lengthEl.value);
  const charset = buildCharset();
  if (!charset) return alert("Choose at least one character set.");
  let pass = "";
  // ensure at least one of each selected type
  const required = [];
  if (upper.checked) required.push(UPPER);
  if (lower.checked) required.push(LOWER);
  if (numbers.checked) required.push(NUMS);
  if (symbols.checked) required.push(SYMS);

  // add one from each required to guarantee presence
  required.forEach((set) => {
    const ch = set[secureRandomInt(set.length)];
    pass += ch;
  });

  for (let i = pass.length; i < len; i++) {
    pass += charset[secureRandomInt(charset.length)];
  }

  // shuffle to avoid predictable positions
  pass = shuffleString(pass);
  output.value = pass;
  evaluateStrength(pass);
}

function shuffleString(s) {
  const arr = s.split("");
  for (let i = arr.length - 1; i > 0; i--) {
    const j = secureRandomInt(i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join("");
}

function evaluateStrength(p) {
  let score = 0;
  if (p.length >= 8) score += 1;
  if (p.length >= 12) score += 1;
  if (/[A-Z]/.test(p)) score += 1;
  if (/[a-z]/.test(p)) score += 1;
  if (/[0-9]/.test(p)) score += 1;
  if (/[^A-Za-z0-9]/.test(p)) score += 1;
  const pct = Math.min(100, Math.round((score / 6) * 100));
  meter.style.width = pct + "%";
  if (pct < 34) {
    strengthText.textContent = "Weak";
  } else if (pct < 67) {
    strengthText.textContent = "Moderate";
  } else {
    strengthText.textContent = "Strong";
  }
}

lengthEl.addEventListener("input", () => {
  lengthLabel.textContent = lengthEl.value;
});

generateBtn.addEventListener("click", generate);

copyBtn.addEventListener("click", () => {
  if (!output.value) return;
  navigator.clipboard.writeText(output.value).then(() => {
    copyBtn.textContent = "Copied!";
    setTimeout(() => (copyBtn.textContent = "Copy"), 1200);
  });
});

shuffleBtn.addEventListener("click", () => {
  if (!output.value) return;
  output.value = shuffleString(output.value);
  evaluateStrength(output.value);
});

downloadBtn.addEventListener("click", () => {
  if (!output.value) return alert("Generate a password first");
  const blob = new Blob([output.value], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "password.txt";
  a.click();
  URL.revokeObjectURL(url);
});

// auto-generate on load
window.addEventListener("load", () => {
  generate();
});
