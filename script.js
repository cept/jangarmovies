// API MENGGUNAKAN AJAX JQUERY

// $('.btn-search').on('click', function () {
//     $.ajax({
//         url: 'http://www.omdbapi.com?apikey=a87119a6&s=' + $('.inputKeyword').val(),
//         success: results => {
//             const movie = results.Search;
//             let card = '';
//             movie.forEach(m => {
//                 card += showMovie(m);

//             });
//             // const cardMovie = document.querySelector('.row');
//             // return cardMovie.innerHTML = card;
//             $('.cardMovie').html(card);

//             // Detail Movie
//             $('.dataDetail').on('click', function () {
//                 // console.log($(this).data('imdbid'));
//                 $.ajax({
//                     url: 'http://www.omdbapi.com?apikey=a87119a6&i=' + $(this).data('imdbid'),
//                     success: result => {
//                         const detailMovie = showMovieDetail(result);


//                         $('.modal-body').html(detailMovie);
//                     },
//                     error: e => {
//                         console.log(e.responseText);
//                     }

//                 });

//             });


//         },
//         error: e => {
//             console.log(e.responseText);
//         }
//     });

// });

// API VANILLA JS FETCH
// const btnSearch = document.querySelector('.btn-search')
// btnSearch.addEventListener('click', function () {
//     const inputKeyword = document.querySelector('.inputKeyword');
//     fetch('http://www.omdbapi.com?apikey=a87119a6&s=' + inputKeyword.value)
//         .then(response => response.json())
//         .then(response => {
//             const movies = response.Search;
//             let cards = '';
//             movies.forEach(m => cards += showMovie(m));

//             const cardMovie = document.querySelector('.cardMovie');
//             cardMovie.innerHTML = cards;


//             // Detail Movie
//             const btnDetail = document.querySelectorAll('.dataDetail');
//             btnDetail.forEach(btn => {
//                 btn.addEventListener('click', function () {
//                     const imdb = this.dataset.imdbid;
//                     fetch('http://www.omdbapi.com?apikey=a87119a6&i=' + imdb)
//                         .then(response => response.json())
//                         .then(result => {
//                             const cardDetail = showMovieDetail(result);

//                             const modalBody = document.querySelector('.modal-body');
//                             modalBody.innerHTML = cardDetail;

//                         });

//                 });
//             });
//         });
// })


// API ASYNC AWAIT FETCH VANILLA JS
const btnSearch = document.querySelector('.btn-search');
btnSearch.addEventListener('click', async function () {
    try {
        const inputKeyword = document.querySelector('.inputKeyword');
        const movies = await getMovie(inputKeyword.value);
        updateUI(movies);
    }
    catch (err) {
        const syntaxAlert = `<div class="alert alert-danger alert-dismissible fade show" role="alert">
                                <strong>${err}</strong>
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                                </button>
                            </div>`;

        const alert = document.querySelector('.alertDiv');
        alert.innerHTML = syntaxAlert;
    }
});

function getMovie(keyword) {
    return fetch('https://www.omdbapi.com?apikey=a87119a6&s=' + keyword)
        .then(response => {
            if (!response.ok) {
                throw new Error(response.statusText)
            }
            return response.json();
        })
        .then(m => {
            if (m.Response === "False") {
                if (m.Error === "Incorrect IMDb ID.") {
                    throw ('Input the movie title!')
                }
                throw (m.Error)
            }
            return m.Search;
        })
}

function updateUI(movies) {
    let cards = '';
    movies.forEach(m => cards += showMovie(m));
    const cardMovie = document.querySelector('.cardMovie')
    cardMovie.innerHTML = cards;
}

// event binding
document.addEventListener('click', async function (e) {
    if (e.target.classList.contains('dataDetail')) {
        const imdb = e.target.dataset.imdbid;
        const movieDetail = await getDetailMovie(imdb);
        updateUIDetail(movieDetail);
    }
});

function getDetailMovie(imdbid) {
    return fetch('https://www.omdbapi.com?apikey=a87119a6&i=' + imdbid)
        .then(response => response.json())
        .then(m => m)
}

function updateUIDetail(movies) {
    const detailMovie = showMovieDetail(movies);
    const modalBody = document.querySelector('.modal-body')
    modalBody.innerHTML = detailMovie;
}

function showMovie(m) {
    return `<div class="col-lg-4 col-md-6 my-3">
                <div class="card">
                    <img src="${m.Poster}" class="card-img-top">
                    <div class="card-body">
                        <h5 class="card-title">${m.Title}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${m.Year}</h6>
                        <a href="#" class="btn btn-dark dataDetail" data-toggle="modal" data-target="#exampleModal" data-imdbid="${m.imdbID}">Show Detail</a>
                    </div>
                </div>
            </div>`;
}

function showMovieDetail(result) {
    return `<div class="container-fluid">
                <div class="row">
                    <div class="col-lg-3 align-self-center">
                        <img src="${result.Poster}" class="img-fluid mb-3">
                    </div>
                    <div class="col">
                        <h4>${result.Title} (${result.Year})</h4>
                        <ul class="list-group">
                            <li class="list-group-item"><strong>Genre : </strong>${result.Genre}</li>
                            <li class="list-group-item"><strong>Actors : </strong>${result.Actors}</li>
                            <li class="list-group-item"><strong>Writer : </strong>${result.Writer}</li>
                            <li class="list-group-item"><strong>Plot : </strong><br>${result.Plot}</li>
                        </ul>
                    </div>
                </div>
             </div>`;
}
