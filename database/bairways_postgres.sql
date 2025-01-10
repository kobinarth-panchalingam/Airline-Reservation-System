BEGIN;
CREATE TABLE customer (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone_number VARCHAR(20) NOT NULL UNIQUE,
    customer_type VARCHAR(20) NOT NULL CHECK (customer_type IN ('guest', 'registered'))
);

CREATE TABLE registered_customer_category (
    id SERIAL PRIMARY KEY,
    category_name VARCHAR(20) NOT NULL UNIQUE, -- e.g., platinum, gold, silver
    discount_rate NUMERIC(5,2) NOT NULL CHECK (discount_rate >= 0 AND discount_rate <= 100)
);

CREATE TABLE registered_customer (
    customer_id INTEGER  PRIMARY KEY,
    registered_customer_category_id INTEGER,
    username VARCHAR(255) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255),
    date_of_birth DATE NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customer(id),
    FOREIGN KEY (registered_customer_category_id) REFERENCES registered_customer_category(id)
);

CREATE TABLE employee (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255),
    email VARCHAR(100) NOT NULL UNIQUE,
    username VARCHAR(255) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'staff'))
);

CREATE TABLE aircraft_model (
    id SERIAL PRIMARY KEY,
    model_name VARCHAR(30) NOT NULL,
    variant VARCHAR(30) NOT NULL,
    manufacturer_name VARCHAR(30),
    seat_capacity INTEGER, -- number of seats
    max_load FLOAT, -- maximum load capacity in kg
    fuel_capacity FLOAT, -- fuel capacity in litres
    average_speed FLOAT -- average speed in km/h
);

CREATE TABLE airplane (
    id SERIAL PRIMARY KEY,
    aircraft_model_id INTEGER NOT NULL,
    FOREIGN KEY (aircraft_model_id) REFERENCES aircraft_model(id)
);

CREATE TABLE location (
    id SERIAL PRIMARY KEY,
    location_name VARCHAR(50) NOT NULL,
    parent_id INTEGER,
    level VARCHAR(10) NOT NULL CHECK (level IN ('country', 'state', 'city')),
    UNIQUE(location_name, parent_id, level),
    FOREIGN KEY (parent_id) REFERENCES location(id)
);

CREATE TABLE airport (
    id SERIAL PRIMARY KEY,
    airport_code VARCHAR(3) NOT NULL UNIQUE,
    location_id INTEGER NOT NULL,
    airport_name VARCHAR(255),
    image_url TEXT UNIQUE,
    FOREIGN KEY (location_id) REFERENCES location(id)
);

CREATE TABLE route (
    id SERIAL PRIMARY KEY,
    origin VARCHAR(3) NOT NULL,
    destination VARCHAR(3) NOT NULL,
    UNIQUE(origin, destination),
    FOREIGN KEY (origin) REFERENCES airport(airport_code) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (destination) REFERENCES airport(airport_code) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE traveler_class (
    id SERIAL PRIMARY KEY,
    class_name VARCHAR(10) NOT NULL UNIQUE
);

CREATE TABLE flight_fare (
    id SERIAL PRIMARY KEY,
    route_id INTEGER NOT NULL,
    traveler_class_id INTEGER NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price > 0),
    UNIQUE(route_id, traveler_class_id),
    FOREIGN KEY (route_id) REFERENCES route(id) ON DELETE CASCADE,
    FOREIGN KEY (traveler_class_id) REFERENCES traveler_class(id) ON DELETE CASCADE
);

CREATE TABLE flight (
    id SERIAL PRIMARY KEY,
    airplane_id INTEGER NOT NULL,
    route_id INTEGER NOT NULL,
    departure_time TIMESTAMP NOT NULL CHECK (departure_time > NOW()),
    arrival_time TIMESTAMP NOT NULL CHECK (arrival_time > departure_time),
    flight_status VARCHAR(20) NOT NULL CHECK (flight_status IN ('scheduled', 'delayed', 'cancelled', 'completed')) DEFAULT 'scheduled',
    FOREIGN KEY (airplane_id) REFERENCES airplane(id),
    FOREIGN KEY (route_id) REFERENCES route(id) ON DELETE CASCADE
);

CREATE TABLE booking (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER,
    flight_id INTEGER,
    traveler_class_id INTEGER,
    total_amount NUMERIC(10,2) NOT NULL,
    booking_date DATE NOT NULL,
    payment_status VARCHAR(20) NOT NULL CHECK (payment_status IN ('pending', 'completed', 'failed')) DEFAULT 'pending',
    FOREIGN KEY (customer_id) REFERENCES customer(id),
    FOREIGN KEY (flight_id) REFERENCES flight(id),
    FOREIGN KEY (traveler_class_id) REFERENCES traveler_class(id)
);

CREATE TABLE passenger (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255),
    date_of_birth DATE NOT NULL,
    passport_number VARCHAR(20) NOT NULL UNIQUE,
    passport_expiry_date DATE NOT NULL,
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('male', 'female', 'other'))
);

CREATE TABLE ticket (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER,
    passenger_id INTEGER,
    seat_number VARCHAR(10) NOT NULL,
    UNIQUE(booking_id, passenger_id),
    FOREIGN KEY (booking_id) REFERENCES booking(id) ON DELETE CASCADE,
    FOREIGN KEY (passenger_id) REFERENCES passenger(id)
);

COMMIT;