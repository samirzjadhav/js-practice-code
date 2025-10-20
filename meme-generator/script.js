const imageUpload = document.getElementById("imageUpload");
const topText = document.getElementById("topText");
const bottomText = document.getElementById("bottomText");
const generateBtn = document.getElementById("generateBtn");
const downloadBtn = document.getElementById("downloadBtn");
const canvas = document.getElementById("memeCanvas");
const ctx = canvas.getContext("2d");

let image = new Image();

imageUpload.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    image.src = reader.result;
  };
  reader.readAsDataURL(file);
});

image.onload = () => drawMeme();

function drawMeme() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const aspect = image.width / image.height;
  const canvasAspect = canvas.width / canvas.height;
  let drawWidth, drawHeight;
  if (aspect > canvasAspect) {
    drawWidth = canvas.width;
    drawHeight = canvas.width / aspect;
  } else {
    drawHeight = canvas.height;
    drawWidth = canvas.height * aspect;
  }
  const x = (canvas.width - drawWidth) / 2;
  const y = (canvas.height - drawHeight) / 2;
  ctx.drawImage(image, x, y, drawWidth, drawHeight);

  ctx.font = "32px Impact";
  ctx.textAlign = "center";
  ctx.fillStyle = "white";
  ctx.strokeStyle = "black";
  ctx.lineWidth = 4;

  if (topText.value) {
    ctx.fillText(topText.value.toUpperCase(), canvas.width / 2, 50);
    ctx.strokeText(topText.value.toUpperCase(), canvas.width / 2, 50);
  }

  if (bottomText.value) {
    ctx.fillText(
      bottomText.value.toUpperCase(),
      canvas.width / 2,
      canvas.height - 20
    );
    ctx.strokeText(
      bottomText.value.toUpperCase(),
      canvas.width / 2,
      canvas.height - 20
    );
  }
}

generateBtn.addEventListener("click", drawMeme);

downloadBtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "meme.png";
  link.href = canvas.toDataURL();
  link.click();
});
