const chatBox = document.getElementById("chatBox");
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");

// 🔑 Replace with your actual OpenAI API key
const OPENAI_API_KEY = "YOUR_OPENAI_API_KEY_HERE";

function addMessage(content, sender) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.textContent = content;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function fetchReply(prompt) {
  addMessage("Typing...", "bot typing");

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    document.querySelector(".typing")?.remove();

    if (data.choices && data.choices[0].message) {
      const reply = data.choices[0].message.content;
      addMessage(reply, "bot");
    } else {
      addMessage("⚠️ Error: Could not get a response.", "bot");
    }
  } catch (err) {
    document.querySelector(".typing")?.remove();
    addMessage("❌ Network error.", "bot");
  }
}

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const userText = userInput.value.trim();
  if (!userText) return;

  addMessage(userText, "user");
  userInput.value = "";
  fetchReply(userText);
});
