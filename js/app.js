// =====================
// DATA
// =====================
const movies = [
  {
    title: "Titanic",
    year: 1997,
    genre: ["Romance", "Drama"],
    poster: "images/titanic.jpg",
    description: "Phim tình cảm kinh điển",
  },
  {
    title: "The Avengers",
    year: 2012,
    genre: ["Action", "Sci-Fi"],
    poster: "images/avengers.jpg",
    description: "Biệt đội siêu anh hùng",
  },
  {
    title: "Inception",
    year: 2010,
    genre: ["Sci-Fi"],
    poster: "images/inception.jpg",
    description: "Giấc mơ trong giấc mơ",
  },
];

// =====================
// DOM
// =====================
const movieList = document.getElementById("movie-list");
const genreDiv = document.getElementById("genre-filters");
const searchInput = document.getElementById("search");

const modal = document.getElementById("modal");
const modalBody = document.getElementById("modal-body");
const closeModalBtn = document.getElementById("close-modal");

const toggle = document.getElementById("theme-toggle");

// =====================
// RENDER MOVIES
// =====================
function renderMovies(list) {
  movieList.innerHTML = "";

  if (list.length === 0) {
    movieList.innerHTML = "<p>Không tìm thấy phim</p>";
    return;
  }

  list.forEach((movie) => {
    const div = document.createElement("div");
    div.className = "movie-card";

    div.innerHTML = `
      <img src="${movie.poster}">
      <h3>${movie.title}</h3>
      <p>${movie.year}</p>
    `;

    div.onclick = () => openModal(movie);

    movieList.appendChild(div);
  });
}

// =====================
// GENRE FILTER
// =====================
function renderGenres() {
  const genres = [...new Set(movies.flatMap((m) => m.genre))];

  genres.forEach((g) => {
    const label = document.createElement("label");

    label.innerHTML = `
      <input type="checkbox" value="${g}"> ${g}
    `;

    genreDiv.appendChild(label);
  });
}

// =====================
// FILTER
// =====================
function filterMovies() {
  const keyword = searchInput.value.toLowerCase();

  const checkedGenres = [
    ...document.querySelectorAll("#genre-filters input:checked"),
  ].map((cb) => cb.value);

  const filtered = movies.filter((movie) => {
    const matchName = movie.title.toLowerCase().includes(keyword);

    const matchGenre =
      checkedGenres.length === 0 ||
      checkedGenres.some((g) => movie.genre.includes(g));

    return matchName && matchGenre;
  });

  renderMovies(filtered);
}

// =====================
// DEBOUNCE
// =====================
function debounce(func, delay) {
  let timeout;
  return function () {
    clearTimeout(timeout);
    timeout = setTimeout(func, delay);
  };
}

// =====================
// MODAL
// =====================
function openModal(movie) {
  modal.classList.remove("hidden");

  modalBody.innerHTML = `
    <h2>${movie.title}</h2>
    <img src="${movie.poster}" width="200">
    <p><b>Năm:</b> ${movie.year}</p>
    <p><b>Thể loại:</b> ${movie.genre.join(", ")}</p>
    <p>${movie.description}</p>
  `;
}

closeModalBtn.onclick = () => modal.classList.add("hidden");

window.onclick = (e) => {
  if (e.target === modal) modal.classList.add("hidden");
};

// =====================
// DARK MODE
// =====================
toggle.onclick = () => {
  document.body.classList.toggle("dark");

  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark") ? "dark" : "light",
  );
};

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

// =====================
// EVENTS
// =====================
searchInput.addEventListener("input", debounce(filterMovies, 400));

document.addEventListener("change", (e) => {
  if (e.target.matches("#genre-filters input")) {
    filterMovies();
  }
});

// =====================
// INIT
// =====================
renderGenres();
renderMovies(movies);
