const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const result = document.getElementById("result");

// 🧩 Get a free API key from https://www.omdbapi.com/apikey.aspx
const API_KEY = "YOUR_OMDB_API_KEY";

async function getMovie(title) {
  result.innerHTML = `<p class="muted">Searching...</p>`;
  try {
    const response = await fetch(
      `https://www.omdbapi.com/?t=${encodeURIComponent(
        title
      )}&apikey=${API_KEY}`
    );
    const data = await response.json();

    if (data.Response === "False") {
      result.innerHTML = `<p class="muted">❌ No movie found with that title.</p>`;
      return;
    }

    const poster =
      data.Poster !== "N/A"
        ? data.Poster
        : "https://via.placeholder.com/100x150?text=No+Image";
    result.innerHTML = `
      <div class="movie-card">
        <img src="${poster}" alt="${data.Title} poster">
        <div class="movie-info">
          <h2>${data.Title} (${data.Year})</h2>
          <p><strong>⭐ IMDb:</strong> ${data.imdbRating}</p>
          <p><strong>🎭 Genre:</strong> ${data.Genre}</p>
          <p><strong>📅 Released:</strong> ${data.Released}</p>
          <p><strong>🧑‍💼 Director:</strong> ${data.Director}</p>
          <p><strong>📝 Plot:</strong> ${data.Plot}</p>
        </div>
      </div>
    `;
  } catch (error) {
    result.innerHTML = `<p class="muted">⚠️ Something went wrong. Please try again.</p>`;
    console.error(error);
  }
}

searchBtn.addEventListener("click", () => {
  const title = searchInput.value.trim();
  if (!title) {
    result.innerHTML = `<p class="muted">Please enter a movie name.</p>`;
    return;
  }
  getMovie(title);
});

searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    searchBtn.click();
  }
});
