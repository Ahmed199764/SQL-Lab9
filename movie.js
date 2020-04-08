'use strict';

function movieHandler(request, response) {
    const values = request.query.values;
    superagent(
        `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${request.query.search_query}`
    )
        .then((trailRes1) => {
            const movieData = trailRes1.body;
            const locationData = new Movie(values, movieData);
            response.status(200).json(locationData);
        })
        .catch((err) => errorHandler(err, request, response));
}


function Movie(movie) {
    this.title = movie.title;
    this.released_on = movie.release_date;
    this.total_votes = movie.vote_count;
    this.avarage_votes = movie.vote_average;
    this.popularity = movie.popularity;
    this.image_url = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;
    this.overview = movie.overview;
}

module.exports = movieHandler;