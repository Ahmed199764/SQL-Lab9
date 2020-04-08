'use strict';

const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const handler = require('./handler.js');
const client = require('./client.js');
const locationHandler = require('./location.js');
const weatherHandler = require('./weather.js');
const trailHandler = require('./trail.js');
const yelpHandler = require('./yelp.js');
const movieHandler = require('./movie.js');

const PORT = process.env.PORT || 4000;
const app = express();
app.use(cors());

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

function Location(city, geoData) {
    this.search_query = city;
    this.formatted_query = geoData[0].display_name;
    this.latitude = geoData[0].lat;
    this.longitude = geoData[0].lon;
}

app.get('/location', locationHandler);
app.get('/weather', weatherHandler);
app.get('/trails', trailHandler);
app.get('/movie', movieHandler);
app.get('/yelp', yelpHandler);
app.use('*', handler.notFoundHandler);
app.use(handler.errorHandler);

app.listen(PORT, () => console.log(`App is listening on ${PORT}`));
