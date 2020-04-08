'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const pg = require('pg');
const PORT = process.env.PORT || 4000;
const app = express();
const client = new pg.Client(process.env.DATABASE_URL);
app.use(cors());

client.on('error', err => {
  throw new Error(err);
});

app.get('/add', (request, response) => {
  let search_query = request.query.search_query;
  let formatted_query = request.query.formatted_query;
  let latitude = request.query.latitude;
  let longitude = request.query.longitude;
  const SQL = `INSERT INTO locations (search_query, formatted_query, latitude, longitude) VALUES($1, $2, $3, $4) RETURNING *;`;
  const safeValues = [search_query, formatted_query, latitude, longitude];
  client.query(SQL, safeValues).then((results) => {
    response.status(200).json(results.rows);
  })
    .catch((err) => {
      response.status(500).send(err);
    });
});

app.get('/locations', (req, res) => {
  const SQL = 'SELECT * FROM locations;';
  client
    .query(SQL)
    .then((results) => {
      res.status(200).json(results.rows);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

app.get('/', (request, response) => {
    response.send('Home Page!');
  });

client.connect().then(() => {
  app.listen(PORT, () =>
    console.log(`my server is up and running on port ${PORT}`));
}).catch(err => {
  throw new Error(`startup error ${err}`);
});

app.get('/location', locationHandler);
app.get('/weather', weatherHandler);
app.get('/trails', trailHandler);
app.get('/movie', getMovies);
app.use('*', notFoundHandler);
app.use(errorHandler);

function locationHandler(request, response) {
  const city = request.query.city;
  superagent(
    `https://eu1.locationiq.com/v1/search.php?key=${process.env.TRAIL_API_KEY}&lat=${location.latitude}&lon=${location.longitude}`
  )
    .then((res) => {
      const geoData = res.body;
      const locationData = new Location(city, geoData);
      response.status(200).json(locationData);
    })
    .catch((err) => errorHandler(err, request, response));
}


function weatherHandler(request, response) {
  superagent(
    `https://api.weatherbit.io/v2.0/forecast/daily?city=${request.query.search_query}&key=${process.env.WEATHER_API_KEY}`
  )
    .then((weatherRes) => {
      console.log(weatherRes);
      const weatherSummaries = weatherRes.body.data.map((day) => {
        return new Weather(day);
      });
      response.status(200).json(weatherSummaries);
    })
    .catch((err) => errorHandler(err, request, response));
}

function trailHandler(request, response) {
  const city1 = request.query.city1;
  superagent(
    `https://www.hikingproject.com/data/get-trails?key=${process.env.GEOCODE_API_KEY}&key=${process.env.TRAIL_API_KEY}&q=${city1}&format=json`
  )
    .then((trailRes) => {
      const trailData = trailRes.body;
      const locationData = new Trails(city1, trailData);
      response.status(200).json(locationData);
    })
    .catch((err) => errorHandler(err, request, response));
}

function getMovies(request, response) {
    const values = request.query.values;
     superagent(
    `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&language=en-US&query=${request.query.data.search_query}&page=1&include_adult=false`
  )
    .then((trailRes1) => {
      const movieData = trailRes1.body;
      const locationData = new Movie(values, movieData);
      response.status(200).json(locationData);
    })
    .catch((err) => errorHandler(err, request, response));
  }

function Location(city, geoData) {
  this.search_query = city;
  this.formatted_query = geoData[0].display_name;
  this.latitude = geoData[0].lat;
  this.longitude = geoData[0].lon;
}

function Weather(day) {
  this.forecast = day.weather.description;
  this.time = new Date(day.valid_date).toString().slice(0, 15);
}

function Trails(city1, trailData) {
  this.search_query = city1;
  this.name = trailData.name;
  this.location = trailData.location;
  this.length = trailData.length;
  this.stars = trailData.stars;
  this.star_votes = trailData.starVotes;
  this.summary = trailData.summary;
  this.trail_url = trailData.url;
  this.conditions = trailData.conditionStatus;
  this.condition_date = trailData.conditionDate;
  this.condition_time = trailData.conditionDate;
}

function Movie(movie){
    this.title=movie.title;
    this.released_on=movie.release_date;
    this.total_votes=movie.vote_count;
    this.avarage_votes=movie.vote_average;
    this.popularity=movie.popularity;
    this.image_url=`https://image.tmdb.org/t/p/original${movie.backdrop_path}`;
    this.overview=movie.overview;
  }

function notFoundHandler(request, response) {
  response.status(404).send('huh?');
}

function errorHandler(error, request, response) {
  response.status(500).send(error);
}

app.listen(PORT, () => console.log(`App is listening on ${PORT}`));
