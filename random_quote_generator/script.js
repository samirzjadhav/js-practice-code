const quotes = [
  {
    text: "The best way to get started is to quit talking and begin doing.",
    author: "Walt Disney",
  },
  {
    text: "Don’t let yesterday take up too much of today.",
    author: "Will Rogers",
  },
  {
    text: "It’s not whether you get knocked down, it’s whether you get up.",
    author: "Vince Lombardi",
  },
  {
    text: "If you are working on something exciting, it will keep you motivated.",
    author: "Steve Jobs",
  },
  {
    text: "Success is not final; failure is not fatal: It is the courage to continue that counts.",
    author: "Winston Churchill",
  },
];

function generateQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const selectedQuote = quotes[randomIndex];
  document.getElementById("quote").innerText = `"${selectedQuote.text}"`;
  document.getElementById("author").innerText = `– ${selectedQuote.author}`;
}
