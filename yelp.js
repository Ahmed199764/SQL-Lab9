'use strict';

function yelpHandler(request, response) {
    const values1 = request.query.values1;
    superagent(
        `https://api.yelp.com/v3/businesses/search?location=${request.query.search_query}`
    )
        .then((yelplRes1) => {
            const yelpeData = yelplRes1.body;
            const locationData = new Yelp(values1, yelpeData);
            response.status(200).json(locationData);
        })
        .catch((err) => errorHandler(err, request, response));
}

function Yelp(yelp) {
    this.url = yelp.url;
    this.name = yelp.name;
    this.rating = yelp.rating;
    this.price = yelp.price;
    this.image_url = yelp.image_url;
}

module.exports = yelpHandler;