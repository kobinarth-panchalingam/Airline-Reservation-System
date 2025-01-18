BEGIN;

-- Inserting aircraft models with seat capacity and other relevant data
INSERT INTO aircraft_model (model_name, variant, manufacturer_name, seat_capacity, max_load, fuel_capacity, average_speed)
VALUES 
('Boeing 737', 'Standard', 'Boeing', 80, 20500, 26000, 850),  -- Boeing 737
('Boeing 757', 'Classic', 'Boeing', 100, 25000, 35000, 900),  -- Boeing 757
('Airbus A380', 'Standard', 'Airbus', 120, 56000, 70000, 1020);  -- Airbus A380

-- Insert 3 airplanes for Boeing 737
INSERT INTO airplane (aircraft_model_id) VALUES (1); -- Boeing 737
INSERT INTO airplane (aircraft_model_id) VALUES (1); -- Boeing 737
INSERT INTO airplane (aircraft_model_id) VALUES (1); -- Boeing 737

-- Insert 4 airplanes for Boeing 757
INSERT INTO airplane (aircraft_model_id) VALUES (2); -- Boeing 757
INSERT INTO airplane (aircraft_model_id) VALUES (2); -- Boeing 757
INSERT INTO airplane (aircraft_model_id) VALUES (2); -- Boeing 757
INSERT INTO airplane (aircraft_model_id) VALUES (2); -- Boeing 757

-- Insert 1 airplane for Airbus A380
INSERT INTO airplane (aircraft_model_id) VALUES (3); -- Airbus A380


-----------------------------------------------------------------
-----------------------------------------------------------------

INSERT INTO location (location_name, parent_id, level) VALUES 
('Indonesia', -1, 'country'), -- id = 1
('Sri Lanka', -1, 'country'), -- id = 2
('India', -1, 'country'), -- id = 3
('Thailand', -1, 'country'), -- id = 4
('Singapore', -1, 'country'); -- id = 5

-- States/Provinces in Indonesia
INSERT INTO location (location_name, parent_id, level) VALUES 
('Banten', 1, 'state'), -- id = 6
('Bali', 1, 'state'); -- id = 7

-- States/Provinces in Sri Lanka
INSERT INTO location (location_name, parent_id, level) VALUES 
('Western Province', 2, 'state'), -- id = 8
('Southern Province', 2, 'state'); -- id = 9

-- States/Provinces in India
INSERT INTO location (location_name, parent_id, level) VALUES 
('Delhi', 3, 'state'), -- id = 10
('Maharashtra', 3, 'state'), -- id = 11
('Tamil Nadu', 3, 'state'); -- id = 12

-- States/Provinces in Thailand
INSERT INTO location (location_name, parent_id, level) VALUES 
('Samut Prakan Province', 4, 'state'), -- id = 13
('Bangkok Metropolitan Region', 4, 'state'); -- id = 14

-- Cities in Indonesia
INSERT INTO location (location_name, parent_id, level) VALUES 
('Jakarta', 6, 'city'), -- id = 15 (Banten > Jakarta)
('Denpasar', 7, 'city'); -- id = 16 (Bali > Denpasar)

-- Cities in Sri Lanka
INSERT INTO location (location_name, parent_id, level) VALUES 
('Katunayake', 8, 'city'), -- id = 17 (Western Province > Katunayake)
('Mattala', 9, 'city'); -- id = 18 (Southern Province > Mattala)

-- Cities in India
INSERT INTO location (location_name, parent_id, level) VALUES 
('New Delhi', 10, 'city'), -- id = 19 (Delhi > New Delhi)
('Mumbai', 11, 'city'), -- id = 20 (Maharashtra > Mumbai)
('Chennai', 12, 'city'); -- id = 21 (Tamil Nadu > Chennai)

-- Cities in Thailand
INSERT INTO location (location_name, parent_id, level) VALUES 
('Bangkok', 13, 'city'), -- id = 22 (Samut Prakan Province > Bangkok)
('Bangkok', 14, 'city'); -- id = 23 (Bangkok Metropolitan Region > Bangkok)

-- City in Singapore
INSERT INTO location (location_name, parent_id, level) VALUES 
('Singapore', 5, 'city'); -- id = 24 (Singapore > Singapore)


-------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------

-- Airports in Indonesia
INSERT INTO airport (airport_code, location_id, airport_name, image_url) VALUES 
('CGK', 15, 'Soekarno–Hatta International Airport', 'http://example.com/cgk.jpg'), -- Jakarta > CGK
('DPS', 16, 'Ngurah Rai International Airport', 'http://example.com/dps.jpg'); -- Denpasar > DPS

-- Airports in Sri Lanka
INSERT INTO airport (airport_code, location_id, airport_name, image_url) VALUES 
('BIA', 17, 'Bandaranaike International Airport', 'http://example.com/bia.jpg'), -- Katunayake > BIA
('HRI', 18, 'Mattala Rajapaksa International Airport', 'http://example.com/hri.jpg'); -- Mattala > HRI

-- Airports in India
INSERT INTO airport (airport_code, location_id, airport_name, image_url) VALUES 
('DEL', 19, 'Indira Gandhi International Airport', 'http://example.com/del.jpg'), -- New Delhi > DEL
('BOM', 20, 'Chhatrapati Shivaji Maharaj International Airport', 'http://example.com/bom.jpg'), -- Mumbai > BOM
('MAA', 21, 'Chennai International Airport', 'http://example.com/maa.jpg'); -- Chennai > MAA

-- Airports in Thailand
INSERT INTO airport (airport_code, location_id, airport_name, image_url) VALUES 
('BKK', 22, 'Suvarnabhumi Airport', 'http://example.com/bkk.jpg'), -- Bangkok (Samut Prakan) > BKK
('DMK', 23, 'Don Mueang International Airport', 'http://example.com/dmk.jpg'); -- Bangkok (Bangkok Metropolitan) > DMK

-- Airport in Singapore
INSERT INTO airport (airport_code, location_id, airport_name, image_url) VALUES 
('SIN', 24, 'Singapore Changi Airport', 'http://example.com/sin.jpg'); -- Singapore > SIN


-------------------------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------------------------

-- Domestic routes in Indonesia
INSERT INTO route (origin, destination) VALUES 
('CGK', 'DPS'),  -- Soekarno–Hatta International Airport to Ngurah Rai International Airport
('DPS', 'CGK');  -- Ngurah Rai International Airport to Soekarno–Hatta International Airport

-- Domestic routes in Sri Lanka
INSERT INTO route (origin, destination) VALUES 
('BIA', 'HRI'),  -- Bandaranaike International Airport to Mattala Rajapaksa International Airport
('HRI', 'BIA');  -- Mattala Rajapaksa International Airport to Bandaranaike International Airport

-- Domestic routes in India
INSERT INTO route (origin, destination) VALUES 
('DEL', 'BOM'),  -- Indira Gandhi International Airport to Chhatrapati Shivaji Maharaj International Airport
('BOM', 'DEL'),  -- Chhatrapati Shivaji Maharaj International Airport to Indira Gandhi International Airport
('DEL', 'MAA'),  -- Indira Gandhi International Airport to Chennai International Airport
('MAA', 'DEL'),  -- Chennai International Airport to Indira Gandhi International Airport
('BOM', 'MAA'),  -- Chhatrapati Shivaji Maharaj International Airport to Chennai International Airport
('MAA', 'BOM');  -- Chennai International Airport to Chhatrapati Shivaji Maharaj International Airport

-- Domestic routes in Thailand
INSERT INTO route (origin, destination) VALUES 
('BKK', 'DMK'),  -- Suvarnabhumi Airport to Don Mueang International Airport
('DMK', 'BKK');  -- Don Mueang International Airport to Suvarnabhumi Airport

-- International routes
-- Indonesia to Sri Lanka
INSERT INTO route (origin, destination) VALUES 
('CGK', 'BIA'),  -- Soekarno–Hatta International Airport to Bandaranaike International Airport
('BIA', 'CGK');  -- Bandaranaike International Airport to Soekarno–Hatta International Airport

-- Indonesia to India
INSERT INTO route (origin, destination) VALUES 
('CGK', 'DEL'),  -- Soekarno–Hatta International Airport to Indira Gandhi International Airport
('DEL', 'CGK'),  -- Indira Gandhi International Airport to Soekarno–Hatta International Airport
('DPS', 'BOM'),  -- Ngurah Rai International Airport to Chhatrapati Shivaji Maharaj International Airport
('BOM', 'DPS');  -- Chhatrapati Shivaji Maharaj International Airport to Ngurah Rai International Airport

-- Indonesia to Thailand
INSERT INTO route (origin, destination) VALUES 
('CGK', 'BKK'),  -- Soekarno–Hatta International Airport to Suvarnabhumi Airport
('BKK', 'CGK'),  -- Suvarnabhumi Airport to Soekarno–Hatta International Airport
('DPS', 'BKK'),  -- Ngurah Rai International Airport to Suvarnabhumi Airport
('BKK', 'DPS');  -- Suvarnabhumi Airport to Ngurah Rai International Airport

-- Indonesia to Singapore
INSERT INTO route (origin, destination) VALUES 
('CGK', 'SIN'),  -- Soekarno–Hatta International Airport to Singapore Changi Airport
('SIN', 'CGK'),  -- Singapore Changi Airport to Soekarno–Hatta International Airport
('DPS', 'SIN'),  -- Ngurah Rai International Airport to Singapore Changi Airport
('SIN', 'DPS');  -- Singapore Changi Airport to Ngurah Rai International Airport

-- Sri Lanka to India
INSERT INTO route (origin, destination) VALUES 
('BIA', 'DEL'),  -- Bandaranaike International Airport to Indira Gandhi International Airport
('DEL', 'BIA'),  -- Indira Gandhi International Airport to Bandaranaike International Airport
('HRI', 'BOM'),  -- Mattala Rajapaksa International Airport to Chhatrapati Shivaji Maharaj International Airport
('BOM', 'HRI');  -- Chhatrapati Shivaji Maharaj International Airport to Mattala Rajapaksa International Airport

-- Sri Lanka to Thailand
INSERT INTO route (origin, destination) VALUES 
('BIA', 'BKK'),  -- Bandaranaike International Airport to Suvarnabhumi Airport
('BKK', 'BIA'),  -- Suvarnabhumi Airport to Bandaranaike International Airport
('HRI', 'DMK'),  -- Mattala Rajapaksa International Airport to Don Mueang International Airport
('DMK', 'HRI');  -- Don Mueang International Airport to Mattala Rajapaksa International Airport

-- Sri Lanka to Singapore
INSERT INTO route (origin, destination) VALUES 
('BIA', 'SIN'),  -- Bandaranaike International Airport to Singapore Changi Airport
('SIN', 'BIA'),  -- Singapore Changi Airport to Bandaranaike International Airport
('HRI', 'SIN'),  -- Mattala Rajapaksa International Airport to Singapore Changi Airport
('SIN', 'HRI');  -- Singapore Changi Airport to Mattala Rajapaksa International Airport

-- India to Thailand
INSERT INTO route (origin, destination) VALUES 
('DEL', 'BKK'),  -- Indira Gandhi International Airport to Suvarnabhumi Airport
('BKK', 'DEL'),  -- Suvarnabhumi Airport to Indira Gandhi International Airport
('BOM', 'BKK'),  -- Chhatrapati Shivaji Maharaj International Airport to Suvarnabhumi Airport
('BKK', 'BOM'),  -- Suvarnabhumi Airport to Chhatrapati Shivaji Maharaj International Airport
('MAA', 'DMK'),  -- Chennai International Airport to Don Mueang International Airport
('DMK', 'MAA');  -- Don Mueang International Airport to Chennai International Airport

-- India to Singapore
INSERT INTO route (origin, destination) VALUES 
('DEL', 'SIN'),  -- Indira Gandhi International Airport to Singapore Changi Airport
('SIN', 'DEL'),  -- Singapore Changi Airport to Indira Gandhi International Airport
('BOM', 'SIN'),  -- Chhatrapati Shivaji Maharaj International Airport to Singapore Changi Airport
('SIN', 'BOM'),  -- Singapore Changi Airport to Chhatrapati Shivaji Maharaj International Airport
('MAA', 'SIN'),  -- Chennai International Airport to Singapore Changi Airport
('SIN', 'MAA');  -- Singapore Changi Airport to Chennai International Airport

-- Thailand to Singapore
INSERT INTO route (origin, destination) VALUES 
('BKK', 'SIN'),  -- Suvarnabhumi Airport to Singapore Changi Airport
('SIN', 'BKK'),  -- Singapore Changi Airport to Suvarnabhumi Airport
('DMK', 'SIN'),  -- Don Mueang International Airport to Singapore Changi Airport
('SIN', 'DMK');  -- Singapore Changi Airport to Don Mueang International Airport


------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------

-- Flight 1
INSERT INTO flight (airplane_id, route_id, departure_time, arrival_time, flight_status) 
VALUES 
(1, 2, '2025-02-01 08:30:00', '2025-02-01 10:00:00', 'scheduled');

-- Flight 2
INSERT INTO flight (airplane_id, route_id, departure_time, arrival_time, flight_status) 
VALUES 
(2, 5, '2025-02-01 09:00:00', '2025-02-01 11:00:00', 'completed');

-- Flight 3
INSERT INTO flight (airplane_id, route_id, departure_time, arrival_time, flight_status) 
VALUES 
(3, 7, '2025-02-01 10:30:00', '2025-02-01 12:30:00', 'cancelled');

-- Flight 4
INSERT INTO flight (airplane_id, route_id, departure_time, arrival_time, flight_status) 
VALUES 
(4, 10, '2025-02-01 11:00:00', '2025-02-01 13:00:00', 'scheduled');

-- Flight 5
INSERT INTO flight (airplane_id, route_id, departure_time, arrival_time, flight_status) 
VALUES 
(5, 12, '2025-02-01 12:30:00', '2025-02-01 14:00:00', 'delayed');

-- Flight 6
INSERT INTO flight (airplane_id, route_id, departure_time, arrival_time, flight_status) 
VALUES 
(6, 3, '2025-02-01 13:00:00', '2025-02-01 15:00:00', 'completed');

-- Flight 7
INSERT INTO flight (airplane_id, route_id, departure_time, arrival_time, flight_status) 
VALUES 
(7, 15, '2025-02-01 14:30:00', '2025-02-01 16:00:00', 'scheduled');

-- Flight 8
INSERT INTO flight (airplane_id, route_id, departure_time, arrival_time, flight_status) 
VALUES 
(8, 20, '2025-02-01 15:00:00', '2025-02-01 17:00:00', 'cancelled');

-- Flight 9
INSERT INTO flight (airplane_id, route_id, departure_time, arrival_time, flight_status) 
VALUES 
(1, 22, '2025-02-01 16:00:00', '2025-02-01 18:00:00', 'scheduled');

-- Flight 10
INSERT INTO flight (airplane_id, route_id, departure_time, arrival_time, flight_status) 
VALUES 
(2, 30, '2025-02-01 17:00:00', '2025-02-01 19:00:00', 'delayed');

-- Flight 11
INSERT INTO flight (airplane_id, route_id, departure_time, arrival_time, flight_status) 
VALUES 
(3, 25, '2025-02-01 18:00:00', '2025-02-01 20:00:00', 'completed');

-- Flight 12
INSERT INTO flight (airplane_id, route_id, departure_time, arrival_time, flight_status) 
VALUES 
(4, 35, '2025-02-01 19:30:00', '2025-02-01 21:00:00', 'scheduled');

-- Flight 13
INSERT INTO flight (airplane_id, route_id, departure_time, arrival_time, flight_status) 
VALUES 
(5, 40, '2025-02-01 20:00:00', '2025-02-01 22:00:00', 'delayed');

-- Flight 14
INSERT INTO flight (airplane_id, route_id, departure_time, arrival_time, flight_status) 
VALUES 
(6, 45, '2025-02-01 21:00:00', '2025-02-01 23:00:00', 'cancelled');

-- Flight 15
INSERT INTO flight (airplane_id, route_id, departure_time, arrival_time, flight_status) 
VALUES 
(7, 50, '2025-02-02 08:00:00', '2025-02-02 10:00:00', 'scheduled');

-- Flight 16
INSERT INTO flight (airplane_id, route_id, departure_time, arrival_time, flight_status) 
VALUES 
(8, 14, '2025-02-02 09:30:00', '2025-02-02 11:30:00', 'completed');

-- Flight 17
INSERT INTO flight (airplane_id, route_id, departure_time, arrival_time, flight_status) 
VALUES 
(1, 20, '2025-02-02 10:00:00', '2025-02-02 12:00:00', 'delayed');

-- Flight 18
INSERT INTO flight (airplane_id, route_id, departure_time, arrival_time, flight_status) 
VALUES 
(2, 15, '2025-02-02 11:00:00', '2025-02-02 13:00:00', 'scheduled');

-- Flight 19
INSERT INTO flight (airplane_id, route_id, departure_time, arrival_time, flight_status) 
VALUES 
(3, 12, '2025-02-02 12:00:00', '2025-02-02 14:00:00', 'cancelled');

-- Flight 20
INSERT INTO flight (airplane_id, route_id, departure_time, arrival_time, flight_status) 
VALUES 
(4, 30, '2025-02-02 13:00:00', '2025-02-02 15:00:00', 'completed');

-- Flight 21
INSERT INTO flight (airplane_id, route_id, departure_time, arrival_time, flight_status) 
VALUES 
(5, 35, '2025-02-02 14:00:00', '2025-02-02 16:00:00', 'scheduled');

-- Flight 22
INSERT INTO flight (airplane_id, route_id, departure_time, arrival_time, flight_status) 
VALUES 
(6, 40, '2025-02-02 15:00:00', '2025-02-02 17:00:00', 'delayed');

-- Flight 23
INSERT INTO flight (airplane_id, route_id, departure_time, arrival_time, flight_status) 
VALUES 
(7, 45, '2025-02-02 16:00:00', '2025-02-02 18:00:00', 'completed');

-- Flight 24
INSERT INTO flight (airplane_id, route_id, departure_time, arrival_time, flight_status) 
VALUES 
(8, 50, '2025-02-02 17:00:00', '2025-02-02 19:00:00', 'cancelled');

-- Flight 25
INSERT INTO flight (airplane_id, route_id, departure_time, arrival_time, flight_status) 
VALUES 
(1, 54, '2025-02-02 18:00:00', '2025-02-02 20:00:00', 'scheduled');

-- Flight 26
INSERT INTO flight (airplane_id, route_id, departure_time, arrival_time, flight_status) 
VALUES 
(2, 23, '2025-02-02 19:00:00', '2025-02-02 21:00:00', 'delayed');

-- Flight 27
INSERT INTO flight (airplane_id, route_id, departure_time, arrival_time, flight_status) 
VALUES 
(3, 10, '2025-02-03 08:00:00', '2025-02-03 10:00:00', 'completed');

-- Flight 28
INSERT INTO flight (airplane_id, route_id, departure_time, arrival_time, flight_status) 
VALUES 
(4, 5, '2025-02-03 09:00:00', '2025-02-03 11:00:00', 'cancelled');

-- Flight 29
INSERT INTO flight (airplane_id, route_id, departure_time, arrival_time, flight_status) 
VALUES 
(5, 15, '2025-02-03 10:00:00', '2025-02-03 12:00:00', 'delayed');

-- Flight 30
INSERT INTO flight (airplane_id, route_id, departure_time, arrival_time, flight_status) 
VALUES 
(6, 25, '2025-02-03 11:30:00', '2025-02-03 13:30:00', 'scheduled');

COMMIT;


SELECT a.*, 
        c.location_name AS country, 
        s.location_name AS state, 
        l.location_name AS city
FROM airport a
JOIN location l ON a.location_id = l.id
LEFT JOIN location s ON l.parent_id = s.id
LEFT JOIN location c ON s.parent_id = c.id
WHERE l.level = 'city' AND s.level = 'state' AND c.level = 'country';