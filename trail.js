'use strict';

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

module.exports = trailHandler;