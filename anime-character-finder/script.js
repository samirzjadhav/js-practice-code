const API_BASE = "https://api.jikan.moe/v4";

const queryEl = document.getElementById("query");
const searchBtn = document.getElementById("searchBtn");
const resultsEl = document.getElementById("results");
const detailPanel = document.getElementById("detailPanel");
const detailContent = document.getElementById("detailContent");
const closeDetail = document.getElementById("closeDetail");

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text) e.textContent = text;
  return e;
}

async function searchCharacters(q) {
  resultsEl.innerHTML = '<p class="hint">Searching…</p>';
  try {
    const url = `${API_BASE}/characters?q=${encodeURIComponent(q)}&limit=24`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.error("Search error", err);
    resultsEl.innerHTML = `<p class="hint">Search failed — see console or try again.</p>`;
    return [];
  }
}

function renderCards(chars) {
  resultsEl.innerHTML = "";
  if (!chars.length) {
    resultsEl.innerHTML = '<p class="hint">No characters found.</p>';
    return;
  }
  chars.forEach((c) => {
    const card = el("div", "card");
    const img = el("img", "thumb");
    img.src = c.images?.jpg?.image_url || c.images?.webp?.image_url || "";
    img.alt = c.name;
    const name = el("div", "name", c.name);
    const alt = el(
      "div",
      "small",
      c.name_kanji
        ? c.name_kanji
        : c.nicknames && c.nicknames[0]
        ? c.nicknames[0]
        : ""
    );
    card.appendChild(img);
    card.appendChild(name);
    card.appendChild(alt);
    card.addEventListener("click", () => openDetail(c.mal_id));
    resultsEl.appendChild(card);
  });
}

async function openDetail(id) {
  detailPanel.classList.remove("hidden");
  detailPanel.setAttribute("aria-hidden", "false");
  detailContent.innerHTML = '<p class="small">Loading details…</p>';
  try {
    const url = `${API_BASE}/characters/${id}/full`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const c = json.data;

    const wrapper = document.createElement("div");
    const meta = document.createElement("div");
    meta.className = "meta";
    const img = document.createElement("img");
    img.src = c.images?.jpg?.image_url || c.images?.webp?.image_url || "";
    img.alt = c.name;
    const info = document.createElement("div");
    const h = document.createElement("h2");
    h.textContent = c.name;
    const small = document.createElement("div");
    small.className = "small";
    small.textContent = c.name_kanji || "";
    info.appendChild(h);
    info.appendChild(small);
    meta.appendChild(img);
    meta.appendChild(info);
    wrapper.appendChild(meta);

    if (c.about) {
      const about = document.createElement("div");
      about.className = "section";
      const p = document.createElement("p");
      p.textContent =
        c.about.length > 800 ? c.about.slice(0, 800) + "…" : c.about;
      about.appendChild(p);
      wrapper.appendChild(about);
    }

    // animeography
    if (c.anime && c.anime.length) {
      const sec = document.createElement("div");
      sec.className = "section";
      const title = document.createElement("h3");
      title.textContent = "Anime Roles";
      const list = document.createElement("ul");
      list.className = "list";
      c.anime.forEach((a) => {
        const li = document.createElement("li");
        li.textContent = `${a.anime?.title || a.name || "—"} as ${
          a.role || "—"
        }`;
        list.appendChild(li);
      });
      sec.appendChild(title);
      sec.appendChild(list);
      wrapper.appendChild(sec);
    }

    // voice actors
    if (c.voices && c.voices.length) {
      const sec = document.createElement("div");
      sec.className = "section";
      const title = document.createElement("h3");
      title.textContent = "Voice Actors";
      const list = document.createElement("ul");
      list.className = "list";
      c.voices.forEach((v) => {
        const li = document.createElement("li");
        const country = v.language || "";
        const name = v.person?.name || v.name || "—";
        li.textContent = `${name} ${country ? "(" + country + ")" : ""}`;
        list.appendChild(li);
      });
      sec.appendChild(title);
      sec.appendChild(list);
      wrapper.appendChild(sec);
    }

    detailContent.innerHTML = "";
    detailContent.appendChild(wrapper);
  } catch (err) {
    console.error("Detail fetch error", err);
    detailContent.innerHTML =
      '<p class="small">Failed to load details. Try again.</p>';
  }
}

closeDetail.addEventListener("click", () => {
  detailPanel.classList.add("hidden");
  detailPanel.setAttribute("aria-hidden", "true");
});

// wire search
searchBtn.addEventListener("click", async () => {
  const q = queryEl.value.trim();
  if (!q) {
    resultsEl.innerHTML = '<p class="hint">Type a name first.</p>';
    return;
  }
  const chars = await searchCharacters(q);
  renderCards(chars);
});

queryEl.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    searchBtn.click();
  }
});

// initial hint
resultsEl.innerHTML =
  '<p class="hint">Type a name and click Search to find characters.</p>';
