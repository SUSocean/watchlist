const searchField = document.getElementById('search-field')
const movieList = document.getElementById('movie-list')
const selectedMovieList = document.getElementById('selected-movie-list')
let searchedArray = []
let selectedMovies = []

// takes input value and get ips respons then uses html template maker to update the dom

function getMovies(input) {
    fetch(`https://www.omdbapi.com/?apikey=59cfe4a9&s=${input}`)
        .then(res => res.json())
        .then(data => {
            let moviesHTML = ``
            data.Search.forEach(movie => {
                fetch(`https://www.omdbapi.com/?apikey=59cfe4a9&i=${movie.imdbID}`)
                    .then(res => res.json())
                    .then(data => {
                        searchedArray.push(data)
                        moviesHTML += getMoviesHTML(data)
                    })
                    .then(() => movieList.innerHTML = moviesHTML)
            });
        })
}

// submit triger

document.addEventListener('submit', function (e) {
    e.preventDefault()
    if (searchField.value) {
        getMovies(searchField.value)
    }
})

// adding/removing movie to the selectedMovies[] and render

document.addEventListener('click', (e) => {
    if (localStorage.length > 0) {
        selectedMovies = JSON.parse(localStorage.getItem('whatchlist'))
    }
    if (e.target.dataset.id) {
        if (!isAdded(e.target.dataset.id)) {
            selectedMovies.push(searchedArray.filter(movie => movie.imdbID == e.target.dataset.id)[0])
            document.getElementById(`${e.target.dataset.id}`).classList.add('added')
        } else {
            const index = selectedMovies.findIndex(movie => movie.imdbID == e.target.dataset.id)
            selectedMovies.splice(index, 1)
            document.getElementById(`${e.target.dataset.id}`).classList.remove('added')
        }
        localStorage.setItem('whatchlist', JSON.stringify(selectedMovies))
    }
})


function render() {
    const selectedFilms = JSON.parse(localStorage.getItem('whatchlist'))
    if (selectedFilms.length == 0) {
        selectedMovieList.innerHTML = `
        <div class="your-whatchlist content">
            <p class="em">Your watchlist is looking a litle empty</p>
            <a id='letsAddMovie' href="./index.html">Lets add some movies!</a>
        </div>
        `
    } else {
        let moviesHTML = ``
        selectedFilms.forEach((data) => moviesHTML += getMoviesHTML(data, 'added'))
        selectedMovieList.innerHTML = moviesHTML
    }

}


// cheks if film is alrady in the selectedMovies[]

function isAdded(id) {
    result = (selectedMovies.filter(movie => movie.imdbID == id).length == 0 ? false : true)
    return result
}

// making html template

function getMoviesHTML(data, added) {
    return `
                            <div class='movie-card container'>
                                <div class='image-container'><img src='${data.Poster}' alt="${data.Title}"></div>
                                    <div class='description-container'>
                                        <div class='movie-title-score'><h4>${data.Title}</h4><span class='score'><i class="fa-solid fa-star"></i> ${data.imdbRating}</span></div>
                                        <div class='movie-info-container'>
                                            <span class='run-time'>${data.Runtime}</span>
                                            <span>${data.Genre}</span>
                                            <button data-id='${data.imdbID}' id='${data.imdbID}' class='${added} add-to-whatchlist-btn'>Watchlist</button>
                                        </div>
                                        <div class='plot'><p id='plot-text'>${data.Plot}</p></div>
                                    </div>
                            </div>
                            `
}


// dark/bright mode changer

function changTheme() {
    document.getElementById('bright').classList.toggle('hidden')
    document.getElementById('dark').classList.toggle('hidden')
    document.getElementById('search-btn').classList.toggle('darken')
    searchField.classList.toggle('darken')
    movieList.classList.toggle('darken')
}

function changThemeW() {
    document.getElementById('bright').classList.toggle('hidden')
    document.getElementById('dark').classList.toggle('hidden')
    selectedMovieList.classList.toggle('darken')
    document.getElementById('letsAddMovie').classList.toggle('darken')
}
