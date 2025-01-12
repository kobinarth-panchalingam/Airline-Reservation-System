-- Insert dummy data into location table
INSERT INTO location (location_name, parent_id, level) VALUES
('United States', NULL, 'country'),
('California', 1, 'state'),
('New York', 1, 'state'),
('Los Angeles', 2, 'city'),
('San Francisco', 2, 'city'),
('New York City', 3, 'city'),
('Sri Lanka', NULL, 'country'),
('Colombo', 7, 'city'),
('Hambantota', 7, 'city');

-- Insert dummy data into airport table
INSERT INTO airport (airport_code, location_id, airport_name, image_url) VALUES
('LAX', 4, 'Los Angeles International Airport', 'http://example.com/lax.jpg'),
('SFO', 5, 'San Francisco International Airport', 'http://example.com/sfo.jpg'),
('JFK', 6, 'John F. Kennedy International Airport', 'http://example.com/jfk.jpg'),
('BIA', 8, 'Bandaranaike International Airport', 'http://example.com/cmb.jpg'),
('MRI', 9, 'Mattala Rajapaksa International Airport', 'http://example.com/hri.jpg');