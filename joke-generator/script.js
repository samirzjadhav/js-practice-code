const quoteBtn = document.getElementById("quoteBtn");
const jokeBtn = document.getElementById("jokeBtn");
const copyBtn = document.getElementById("copyBtn");
const text = document.getElementById("text");
const author = document.getElementById("author");

const quotes = [
  {
    text: "The best way to get started is to quit talking and begin doing.",
    author: "Walt Disney",
  },
  {
    text: "Success is not final; failure is not fatal: It is the courage to continue that counts.",
    author: "Winston Churchill",
  },
  {
    text: "Don't let yesterday take up too much of today.",
    author: "Will Rogers",
  },
  {
    text: "Do what you can with all you have, wherever you are.",
    author: "Theodore Roosevelt",
  },
  {
    text: "It always seems impossible until it’s done.",
    author: "Nelson Mandela",
  },
];

const jokes = [
  "Why don’t scientists trust atoms? Because they make up everything!",
  "Why did the scarecrow win an award? Because he was outstanding in his field!",
  "I told my wife she was drawing her eyebrows too high. She looked surprised.",
  "Why don't programmers like nature? It has too many bugs.",
  "What do you call fake spaghetti? An impasta!",
];

quoteBtn.addEventListener("click", () => {
  const random = quotes[Math.floor(Math.random() * quotes.length)];
  text.textContent = `"${random.text}"`;
  author.textContent = `— ${random.author}`;
});

jokeBtn.addEventListener("click", () => {
  const random = jokes[Math.floor(Math.random() * jokes.length)];
  text.textContent = random;
  author.textContent = "";
});

copyBtn.addEventListener("click", () => {
  const content = `${text.textContent} ${author.textContent}`;
  navigator.clipboard.writeText(content).then(() => {
    copyBtn.textContent = "Copied!";
    setTimeout(() => (copyBtn.textContent = "Copy Text"), 1200);
  });
});
