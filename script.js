const API_KEY = "8c8e1a50-6322-4135-8875-5d40a5420d86";

const API_URL_POPULAR = "https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=1";

const API_URL_SEARCH = "https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=";

getMovies(API_URL_POPULAR);

async function getMovies(url) {
    const resp = await fetch (url, {
        headers: {
            "Content-Type": "application/json",
            "X-API-KEY": API_KEY,
        },
    });
    const respData = await resp.json();
    console.log(respData);
    showMovies(respData);
}

function getClassByRate(vote) {
    if (vote >= 7) {
        return "green";
    } else if (vote > 5) {
        return "orange";
    } else if (vote > 0 && vote <= 5) {
        return "red";
    } else {
        return "err"
    }
}

function showMovies(data) {
    const moviesEl = document.querySelector('.movies');

    // Очищаем предыдущие фильмы
    document.querySelector('.movies').innerHTML = '';

    data.films.forEach(movie => {
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');
        if (movie.rating.includes('%')) {
            let voteSlice = movie.rating.slice(0, -1);
            let voteToNum = Number(voteSlice);
            let newVote = (voteToNum / 10).toFixed(1);
            movie.rating = newVote;
        }

        if(movie.rating != 'null') {
            movieEl.innerHTML = `
                <div class="movie-cover-inner">
                    <img class="movie-cover" src="${movie.posterUrlPreview}" alt="${movie.nameRu}" />
                    <div class="movie-cover-darkened">
                    </div>
                </div>
                <div class="movie-info">
                    <div class="movie-title">
                        ${movie.nameRu} (${movie.year})
                    </div>
                    <div class="movie-category">
                        ${movie.genres.map((genre) => `${genre.genre}`).slice(0, 3)
            }
                    </div>
                    ${
                movie.rating != 'null' &&
                `
                    <div class="movie-average movie-average-${getClassByRate(movie.rating)}">
                        ${movie.rating}
                    </div>
                    `
            }
                </div>
                    `;
        }
        else {
            movieEl.innerHTML = `
                <div class="movie-cover-inner">
                    <img class="movie-cover" src="${movie.posterUrlPreview}" alt="${movie.nameRu}" />
                    <div class="movie-cover-darkened">
                    </div>
                </div>
                <div class="movie-info">
                    <div class="movie-title">
                        ${movie.nameRu} (${movie.year})
                    </div>
                    <div class="movie-category">
                        ${movie.genres.map((genre) => `${genre.genre}`).slice(0, 3)
            }
                    </div>
                    <div class="movie-average movie-average-${getClassByRate(movie.rating)}">
                        N/A
                    </div>
                </div>
                    `;
        }
        moviesEl.appendChild(movieEl);
    });
}

const form = document.querySelector('form');
const search = document.querySelector('.header-search');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const apiSearchUrl = `${API_URL_SEARCH}${search.value}`;
    if (search.value) {
        getMovies(apiSearchUrl);

        search.value = '';
    }
});