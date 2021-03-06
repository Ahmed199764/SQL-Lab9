DROP TABLE weathers, locations, trails, movies,yelp;

CREATE TABLE IF NOT EXISTS locations (
    id SERIAL PRIMARY KEY,
    search_query VARCHAR(225),
    formatted_query VARCHAR(255),
    latitude NUMERIC(8,6),
    longitude NUMERIC(9,6)
);

CREATE TABLE IF NOT EXISTS weathers (
    id SERIAL PRIMARY KEY,
    forecast VARCHAR(225),
    time VARCHAR(255),
    location_id INTEGER NOT NULL,
    FOREIGN KEY (location_id) REFERENCES locations (id)
);

CREATE TABLE IF NOT EXISTS trails (
    id SERIAL PRIMARY KEY,
    trail_url VARCHAR (255),
    name VARCHAR(255),
    location VARCHAR(225),
    length NUMERIC(2,1),
    condition_date VARCHAR(255),
    condition_time VARCHAR(15),
    condition VARCHAR (255),
    stars NUMERIC (2,1),
    stars_votes VARCHAR(255),
    summary VARCHAR (255),
    location_id INTEGER NOT NULL,
    FOREIGN KEY (location_id) REFERENCES locations (id)
);
CREATE TABLE IF NOT EXISTS movies (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  overview VARCHAR(1000),
  average_votes NUMERIC(5,2),
  total_votes INTEGER,
  image_url VARCHAR(255),
  popularity NUMERIC(3,1),
  released_on VARCHAR(255),
  location_id INTEGER NOT NULL,
  FOREIGN KEY (location_id) REFERENCES locations (id)
);

CREATE TABLE IF NOT EXISTS yelp (
    id SERIAL PRIMARY KEY,
    url VARCHAR (255),
    name VARCHAR(255),
    rating NUMERIC (2,1),
    price NUMERIC(3,2),
    image_url VARCHAR (255),
    location_id INTEGER NOT NULL,
    FOREIGN KEY (location_id) REFERENCES locations (id)
);