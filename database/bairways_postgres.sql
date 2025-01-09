-- TABLE Aircraft Model
CREATE TABLE aircraft_model (
    id SERIAL PRIMARY KEY,
    model_name VARCHAR(30),
    variant VARCHAR(30),
    manufacturer_name VARCHAR(30),
    economy_seat_capacity INTEGER, 
    business_seat_capacity INTEGER,
    platinum_seat_capacity INTEGER,
    max_load FLOAT, -- maximum load capacity in kg
    fuel_capacity FLOAT, -- fuel capacity in litres
    average_speed FLOAT -- average speed in km/h
)

CREATE TABLE airplane {
    id SERIAL PRIMARY KEY,
    aircraft_model_id INTEGER REFERENCES aircraft_model(id)
}

CREATE TABLE airport {
    id SERIAL PRIMARY KEY,
    airport_code VARCHAR(3) UNIQUE,
    address_id INTEGER REFERENCES address(id),
    name VARCHAR(255),
    image_url TEXT UNIQUE
}

CREATE TABLE address {
    id SERIAL PRIMARY KEY,
    country VARCHAR(50),
    state VARCHAR(50),
    city VARCHAR(50),
}

CREATE TABLE route {
    id SERIAL PRIMARY KEY,
    origin VARCHAR(3) REFERENCES airport(id),
    destination VARCHAR(3) REFERENCES airport(id),
    UNIQUE(origin, destination)
}

CREATE TABLE traveler_class {
    id SERIAL PRIMARY KEY,
    name VARCHAR(10) UNIQUE
}

CREATE TABLE fare {
    id SERIAL PRIMARY KEY,
    route_id INTEGER REFERENCES route(id),
    traveler_class_id INTEGER REFERENCES traveler_class(id),
    price NUMERIC(10, 2),
    UNIQUE(route_id, traveler_class_id)
}

CREATE TABLE flight {
    id SERIAL PRIMARY KEY,
    airplane_id INTEGER REFERENCES airplane(id),
    route_id INTEGER REFERENCES route(id),
    arrival_time TIMESTAMP,
    departure_time TIMESTAMP,
}