const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const MOVIES_PER_PAGE = 12

const movies = []
let filteredMovies = []

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')


function renderMovieList(data) {
  let rawHTML = ''

  // processing
  data.forEach((item) => {
    // title, image
    console.log(item)
    rawHTML += `<div class="col-sm-3">
        <div class="mb-2">
          <div class="card">
            <img
              src="${POSTER_URL + item.image}"
              class="card-img-top" alt="Movie Poster">
            <div class="card-body">
              <h5 class="card-title">${item.title}</h5>
            </div>
            <div class="card-footer">
              <!-- button trigger modal-->
              <button class="btn btn-primary btn-show-movie" data-toggle="modal"
                data-target="#movie-modal" data-id ="${item.id}">More</button>
              <button class="btn btn-info btn-add-favorite" data-id ="${item.id}">+</button>
            </div>
          </div>
        </div>
      </div>`
  })

  dataPanel.innerHTML = rawHTML
}


// 按照頁數，回傳該頁面上的電影資料
function getMoviesByPage(page) {
  const data = filteredMovies.length ? filteredMovies : movies

  // page 1 -> movies: 0-11
  // page 2 -> movies: 12-23
  // page 3 -> movies: 24-35
  const startIndex = (page - 1) * MOVIES_PER_PAGE
  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE)
}


function renderPaginator(amount) {
  // Math.ceil 無條件進位
  const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE)
  let rawHTML = ''
  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }

  paginator.innerHTML = rawHTML

}


function showMovieModal(id) {
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-description')

  axios.get(INDEX_URL + id).then(response => {
    // response.data.results
    const data = response.data.results
    modalTitle.innerText = data.title
    modalDate.innerText = 'Release date: ' + data.release_date
    modalDescription.innerText = data.description
    modalImage.innerHTML = `<img src="${POSTER_URL + data.image}" alt="movie-poster" class="img-fluid">`
  })
}

function addToFavorite(id) {

  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  const movie = movies.find(movie => movie.id === id)

  if (list.some(movie => movie.id === id)) {
    return alert ('This movie is in the list.')
  }

  list.push(movie)

  localStorage.setca('favoriteMovies', JSON.stringify(list))

  // const jsonString = JSON.stringify(list)
  // console.log('json string', jsonString)
  // console.log('json object: ', JSON.parse(jsonString))
}

dataPanel.addEventListener('click', function onPanelClick(event) {
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-add-favorite')) {
    addToFavorite(Number(event.target.dataset.id))
  }
})

paginator.addEventListener('click', function onPaginatorClicked(event) {
  if (event.target.tagName !== 'A') return

  const page = Number(event.target.dataset.page)
  renderMovieList(getMoviesByPage(page))
})

searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLocaleLowerCase()
  

  // if(!keyword.length){
  //   return alert ('Please enter a valid string')
  // }

  // map, filter, reduce
  filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(keyword)
  )

  if (filteredMovies.length === 0) {
    return alert('Cannot find movie with keyword: ' + keyword)
  }

  // for (const movie of movies) {
  //   if (movie.title.toLocaleLowerCase().includes(keyword)) {
  //     filteredMovies.push(movie)
  //   }
  // }

  renderPaginator(filteredMovies.length)
  renderMovieList(getMoviesByPage(1))

})

axios
  .get(INDEX_URL)
  .then((response) => {
    movies.push(...response.data.results)
    // for (const movie of response.data.results) {
    //   movies.push(movie)
    // }
    // // movies.push(response.data.results)
    // console.log(movies)
    renderPaginator(movies.length)
    renderMovieList(getMoviesByPage(1))
  })


