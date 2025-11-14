const promptEl = document.getElementById("prompt");
const lengthEl = document.getElementById("length");
const imgCountEl = document.getElementById("imgCount");
const imgSizeEl = document.getElementById("imgSize");
const generateBtn = document.getElementById("generateBtn");
const clearBtn = document.getElementById("clearBtn");
const statusEl = document.getElementById("status");
const storyEl = document.getElementById("story");
const imagesEl = document.getElementById("images");

const copyStoryBtn = document.getElementById("copyStory");
const downloadStoryBtn = document.getElementById("downloadStory");
const downloadAllBtn = document.getElementById("downloadAll");

function setStatus(s) {
  statusEl.textContent = s;
}

async function generate() {
  const prompt = promptEl.value.trim();
  if (!prompt) return alert("Write a prompt first.");
  const length = lengthEl.value;
  const image_count = Number(imgCountEl.value);
  const image_size = imgSizeEl.value;

  // disable UI
  generateBtn.disabled = true;
  setStatus("Generating story (this may take a few seconds)...");
  storyEl.textContent = "";
  imagesEl.innerHTML = "";

  try {
    const storyResp = await fetch("/api/story", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, length }),
    });
    if (!storyResp.ok) throw new Error("Story generation failed");
    const storyData = await storyResp.json();
    const storyText = storyData.story || "No story returned.";
    storyEl.textContent = storyText;
    setStatus("Story generated.");

    if (image_count > 0) {
      setStatus(
        "Generating images (this can take 10–30s depending on count)..."
      );
      const imgResp = await fetch("/api/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: storyText,
          n: image_count,
          size: image_size,
        }),
      });
      if (!imgResp.ok) throw new Error("Image generation failed");
      const imgData = await imgResp.json();
      if (Array.isArray(imgData.images) && imgData.images.length) {
        imagesEl.innerHTML = "";
        imgData.images.forEach((b64, idx) => {
          const card = document.createElement("div");
          card.className = "image-card";
          const img = document.createElement("img");
          img.src = `data:image/png;base64,${b64}`;
          const lbl = document.createElement("small");
          lbl.textContent = `Image ${idx + 1}`;
          const dl = document.createElement("button");
          dl.textContent = "Download";
          dl.className = "alt";
          dl.addEventListener("click", () =>
            downloadBase64Image(b64, `image-${idx + 1}.png`)
          );
          card.appendChild(img);
          card.appendChild(lbl);
          card.appendChild(dl);
          imagesEl.appendChild(card);
        });
        setStatus("Images generated.");
      } else {
        imagesEl.innerHTML = '<div class="muted">No images returned.</div>';
        setStatus("No images returned.");
      }
    }
  } catch (err) {
    console.error(err);
    alert("Generation failed — check server console and network.");
    setStatus("Error. See console.");
  } finally {
    generateBtn.disabled = false;
  }
}

function downloadBase64Image(b64, filename) {
  const link = document.createElement("a");
  link.href = `data:image/png;base64,${b64}`;
  link.download = filename;
  link.click();
}

copyStoryBtn?.addEventListener("click", () => {
  const text = storyEl.textContent.trim();
  if (!text) return;
  navigator.clipboard.writeText(text);
  setStatus("Story copied to clipboard.");
});

downloadStoryBtn?.addEventListener("click", () => {
  const text = storyEl.textContent.trim();
  if (!text) return;
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "story.txt";
  a.click();
  URL.revokeObjectURL(url);
});

downloadAllBtn?.addEventListener("click", () => {
  const imgs = imagesEl.querySelectorAll("img");
  imgs.forEach((img, i) => {
    const src = img.src;
    const a = document.createElement("a");
    a.href = src;
    a.download = `image-${i + 1}.png`;
    a.click();
  });
});

generateBtn.addEventListener("click", generate);
clearBtn.addEventListener("click", () => {
  promptEl.value = "";
  storyEl.textContent = "Nothing yet — generate a story.";
  imagesEl.innerHTML = "No images yet.";
  setStatus("");
});
