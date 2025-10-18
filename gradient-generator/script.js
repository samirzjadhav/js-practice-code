const color1 = document.getElementById("color1");
const color2 = document.getElementById("color2");
const cssCode = document.getElementById("cssCode");
const randomBtn = document.getElementById("randomBtn");
const copyBtn = document.getElementById("copyBtn");

function setGradient() {
  const grad = `linear-gradient(45deg, ${color1.value}, ${color2.value})`;
  document.body.style.background = grad;
  cssCode.textContent = `background: ${grad};`;
}

function randomColor() {
  return (
    "#" +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")
  );
}

randomBtn.addEventListener("click", () => {
  color1.value = randomColor();
  color2.value = randomColor();
  setGradient();
});

color1.addEventListener("input", setGradient);
color2.addEventListener("input", setGradient);

copyBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(cssCode.textContent);
  copyBtn.textContent = "Copied!";
  setTimeout(() => (copyBtn.textContent = "Copy CSS"), 1500);
});

setGradient();
