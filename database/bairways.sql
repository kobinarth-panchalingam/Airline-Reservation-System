-- phpMyAdmin SQL Dump
-- version 4.8.4
-- https://www.phpmyadmin.net/
-- Generation Time: Apr 27, 2023 at 01:26 PM
-- Server version: 8.0.28-19
-- PHP Version: 7.2.34

/*TOsDO : Find a way to host the database for free*/

DROP DATABASE `bairways`;
CREATE DATABASE `bairways`;
USE `bairways`;


SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bairways`
--

DELIMITER $$
--
-- Procedures
--
CREATE  PROCEDURE `booking_count_report` (`from_date` DATETIME, `to_date` DATETIME)   BEGIN
     SELECT registerd_users.user_type, count(booking_id) as booking_count FROM booking
        RIGHT JOIN registerd_users USING(user_id)
        WHERE booking_id IN
        (
            SELECT booking_id FROM booking WHERE
            booked_date>=from_date AND booked_date<=to_date
        )
        GROUP BY registerd_users.user_type;
END$$

CREATE  PROCEDURE `generate_ticket` (IN `booking_id` VARCHAR(255), IN `seat_nos` VARCHAR(255), IN `passport_numbers` VARCHAR(1000), IN `count` INT)   BEGIN
	declare n integer default 0;
    declare seat_no varchar(5);
    declare passport_number varchar(25);
    declare curr_flight_no int default 0;
	while n < count do
		set seat_no = substring_index(substring_index(seat_nos,',',count-n),',',-1);
        set passport_number = substring_index(substring_index(passport_numbers,',',count-n),',',-1);
		insert into ticket(seat_no, passport_number, booking_id) values(seat_no, passport_number, booking_id);
		
	set n = n + 1;
	end while;
END$$

CREATE  PROCEDURE `insert_passenger` (IN `val_passengerName` VARCHAR(255), IN `val_passportNumber` VARCHAR(50), IN `val_dateOfBirth` DATE)   BEGIN
    DECLARE var_existing_passportNumber varchar(50);
    SELECT passport_number INTO var_existing_passportNumber FROM passenger WHERE passport_number = val_passportNumber;
    
    IF var_existing_passportNumber IS NOT NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Passport number already exists.';
    END IF;

    INSERT INTO passenger (name, passport_number, dob)
    VALUES (val_passengerName, val_passportNumber, val_dateOfBirth);
END$$

CREATE  PROCEDURE `insert_registered_user` (IN `val_firstName` VARCHAR(255), IN `val_lastName` VARCHAR(255), IN `val_password` VARCHAR(255), IN `val_email` VARCHAR(255), IN `val_phoneNumber` VARCHAR(10), IN `val_gender` VARCHAR(10), IN `val_dateOfBirth` DATE, IN `val_NIC` VARCHAR(12))   BEGIN
	DECLARE var_existing_email varchar(255);
	DECLARE var_existing_phoneNumber varchar(10);
	DECLARE var_existing_NIC varchar(12);
    
    SELECT email INTO var_existing_email 
			FROM registerd_users WHERE email = val_email;

    SELECT phone_number INTO var_existing_phoneNumber 
			FROM registerd_users WHERE phone_number = val_phoneNumber;
            
    SELECT NIC INTO var_existing_NIC 
			FROM registerd_users WHERE NIC = val_NIC;            

    IF LENGTH(val_password) < 8 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Password must be at least 8 characters long.';
    END IF;
    IF NOT (val_password REGEXP '^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).*$') THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Password must contain at least one uppercase letter, one lowercase letter, and one digit.';
    END IF;
    
    IF NOT (LENGTH(val_NIC) = 10 or LENGTH(val_NIC) = 12) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Incorrect NIC number.';
    END IF;
    
        START TRANSACTION;
    IF var_existing_email IS NOT NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Email already exists.';
    END IF;
    
    IF var_existing_phoneNumber IS NOT NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Phone number already exists.';
    END IF;
    
    IF var_existing_NIC IS NOT NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'NIC number already exists.';
    END IF;

    INSERT INTO registerd_users (first_name, last_name, password, email, phone_number, gender, dob, NIC, user_type)
    VALUES (val_firstName, val_lastName, val_password, val_email, val_phoneNumber, val_gender, val_dateOfBirth, val_NIC, "normal");

    COMMIT;

END$$

CREATE  PROCEDURE `passenger_agewise_report` (IN `flight_number` VARCHAR(45))   BEGIN
	SELECT  passenger_name, passport_number, get_age(dob) as age FROM passenger_flight_details 
    WHERE flight_id =
                (
                    SELECT flight_id FROM flights
                    WHERE flights.route_id=flight_number AND flights.flightstatus_id in (1,2)
                    ORDER BY flights.departure_time ASC
                    LIMIT 1
                );
            
	
            
END$$

CREATE  PROCEDURE `passenger_count_report` (`end_destination` VARCHAR(3), `start_time` DATETIME, `end_time` DATETIME)   BEGIN
	 SELECT COUNT(seat_no) as passenger_count
	 FROM ticket 
     JOIN booking ON ticket.booking_id = booking.booking_id 
     JOIN flights ON booking.flight_id = flights.flight_id
     JOIN route ON flights.route_id = route.route_id
     WHERE route.destination=end_destination
	 AND departure_time >= start_time AND departure_time <= end_time;
END$$

CREATE  PROCEDURE `past_flights_report` (`Origin` VARCHAR(3), `Destination` VARCHAR(3))   BEGIN
     SELECT flights.flight_id, airplane_id, flight_no, COUNT(seat_no) as passenger_count FROM ticket
              JOIN booking ON ticket.booking_id = booking.booking_id 
              JOIN flights ON booking.flight_id = flights.flight_id
              WHERE flights.route_id = (
                 SELECT distinct route_id FROM route WHERE route.origin=Origin AND route.destination=Destination
            ) AND flightstatus_id=5
            GROUP BY(flights.flight_id);
END$$

CREATE  PROCEDURE `schedule_flight` (IN `val_airplane_id` VARCHAR(5), IN `val_route_id` INT, IN `val_flightstatus_id` INT, IN `val_departure_time` DATETIME, IN `val_arrival_time` DATETIME, IN `val_flight_no` VARCHAR(45), IN `val_economy_fare` FLOAT, IN `val_business_fare` FLOAT, IN `val_platinum_fare` FLOAT)   BEGIN
	DECLARE var_exisiting_airplane_id varchar(5);
    DECLARE var_exisiting_max_arrival_time datetime;
    DECLARE var_exisiting_last_destination varchar(3);
    DECLARE var_count_route_id int;
    
    select airplane_id into var_exisiting_airplane_id from airplane where airplane_id = val_airplane_id;
    if var_exisiting_airplane_id = NULL then
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid airplane id';
	end if;
    
    select max(arrival_time) into var_exisiting_max_arrival_time from flights where 
    (airplane_id = var_exisiting_airplane_id);
    
    if var_exisiting_max_arrival_time >= val_departure_time then
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid depature time';
	end if;
    
    select destination into var_exisiting_last_destination from route 
    where route_id = (select route_id from flights where arrival_time = var_exisiting_max_arrival_time) ;
    
    -- select destination into var_exisiting_last_destination from
    -- route where route_id = (select route_id from flights where arrival_time =
    -- (select max(arrival_time) from flights where 
    -- (airplane_id = var_exisiting_airplane_id) and (arrival_time < val_depature_time)));
    
    select count(route_id) into var_count_route_id from route 
    where origin = var_exisiting_last_destination and route_id = val_route_id;
    
	if var_count_route_id = 0 then
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid route_id';
	end if;
    
    INSERT INTO flights (airplane_id, route_id, flightstatus_id, departure_time, arrival_time, flight_no, economy_fare, business_fare,platinum_fare)
    VALUES (val_airplane_id , val_route_id , val_flightstatus_id , val_departure_time , val_arrival_time , 
    val_flight_no , val_economy_fare , val_business_fare , val_platinum_fare );
    
END$$

CREATE  PROCEDURE `total_revenue_report` ()   BEGIN
      SELECT  model_name, variant, SUM(amount) as total_revenue
       FROM (
       SELECT b.amount, a.model_id
       FROM booking b 
       JOIN flights f ON b.flight_id = f.flight_id
       JOIN airplane a ON f.airplane_id = a.airplane_id
        where b.status='paid') t1
	   RIGHT JOIN aircraft_model t2 ON t1.model_id = t2.model_id
       GROUP BY model_name, variant;
END$$

--
-- Functions
--
CREATE  FUNCTION `duration` (`start_date` DATETIME, `end_date` DATETIME) RETURNS VARCHAR(50) CHARSET utf8mb4 DETERMINISTIC
BEGIN
	declare diff varchar(10);
    declare output varchar(10);
	select substring_index(sec_to_time(TIMESTAMPDIFF(second, start_date ,end_date )),":",2)
    into diff;
    select 
    concat(substring_index(diff,':',1),"h ",substring_index(diff,':',-1),"m") 
    into output;
RETURN output;
END$$

CREATE  FUNCTION `get_age` (`birthday` DATETIME) RETURNS VARCHAR(10) CHARSET utf8mb4 DETERMINISTIC  
BEGIN
    declare age int;
    declare output varchar(10);
	select TIMESTAMPDIFF(year, birthday ,current_timestamp )
    into age;
    if (age<18) then set output="below 18";
    else set output="above 18";
    end if;
RETURN output;  
END$$

CREATE  FUNCTION `show_routes` (`val_airplane_id` VARCHAR(5)) RETURNS INT DETERMINISTIC  
BEGIN
    DECLARE var_existing_route_id INT DEFAULT 0;
    DECLARE var_exisiting_last_destination VARCHAR(3) DEFAULT '';

    SELECT destination
    INTO var_exisiting_last_destination
    FROM route
    WHERE route_id = (SELECT route_id
                     FROM flights
                     WHERE airplane_id = val_airplane_id 
                       AND flights.arrival_time = (SELECT MAX(arrival_time)
                                          FROM flights
                                          WHERE airplane_id = val_airplane_id));

    RETURN(
    SELECT route_id
                     FROM route
                     WHERE origin = var_exisiting_last_destination LIMIT 1
	);
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`username`, `password`, `name`) VALUES
('admin@gmail.com', '123', 'kobinarth');

-- --------------------------------------------------------

--
-- Table structure for table `aircraft_model`
--

CREATE TABLE `aircraft_model` (
  `model_id` int NOT NULL,
  `model_name` varchar(30) NOT NULL,
  `variant` varchar(30) NOT NULL,
  `manufactur_name` varchar(30) NOT NULL,
  `economy_seatcapacity` int NOT NULL,
  `business_seatcapacity` int NOT NULL,
  `platinum_seatcapacity` int NOT NULL,
  `max_load` float NOT NULL,
  `fuel_capacity (liters)` float NOT NULL,
  `avg_speed (km/h)` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `aircraft_model`
--

INSERT INTO `aircraft_model` (`model_id`, `model_name`, `variant`, `manufactur_name`, `economy_seatcapacity`, `business_seatcapacity`, `platinum_seatcapacity`, `max_load`, `fuel_capacity (liters)`, `avg_speed (km/h)`) VALUES
(1, 'Airbus A380', '800', 'Airbus', 500, 48, 20, 560000, 320000, 900),
(2, 'Boeing 737', 'MAX 10', 'Boeing Commercial', 150, 24, 12, 89765, 26035, 839),
(3, 'Boeing 757', '300', 'Boeing Commercial', 198, 32, 12, 123600, 43400, 918);

-- --------------------------------------------------------

--
-- Table structure for table `airplane`
--

CREATE TABLE `airplane` (
  `airplane_id` varchar(5) NOT NULL,
  `model_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `airplane`
--

INSERT INTO `airplane` (`airplane_id`, `model_id`) VALUES
('A001', 1),
('A002', 2),
('A003', 2),
('A004', 2),
('A005', 3),
('A006', 3),
('A007', 3),
('A008', 3);

-- --------------------------------------------------------

--
-- Table structure for table `airport`
--

CREATE TABLE `airport` (
  `airport_code` varchar(3) NOT NULL,
  `country` varchar(50) NOT NULL,
  `state` varchar(50) NOT NULL,
  `city` varchar(50) NOT NULL,
  `airport_name` varchar(255) NOT NULL,
  `image_url` varchar(1000) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `airport`
--

INSERT INTO `airport` (`airport_code`, `country`, `state`, `city`, `airport_name`, `image_url`) VALUES
('BIA', 'Sri Lanka', 'Western', 'Katunayake', 'Bandaranaike International Airport', 'https://www.andbeyond.com/wp-content/uploads/sites/5/colombo-sri-lanka.jpg'),
('BKK', 'Thailand', 'Samut Prakan', 'Bang Phli', 'Suvarnabhumi Airport', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSG3augAhk0V706qTuVA6lzeIrouw3wJn3MkA&usqp=CAU'),
('BOM', 'India', 'Maharashtra', 'Mumbai', 'Chhatrapati Shivaji Maharaj International Airport', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKUesDZR1Ns-xYpGsj5pU2nck0_GzPKnC62w&usqp=CAU'),
('CGK', 'Indonesia', 'Banten', 'Tangerang', 'Soekarno-Hatta International Airport', 'https://travelvibe.net/wp-content/uploads/2021/06/Best-Places-To-Visit-In-Tangerang-Indonesia.jpg'),
('DEL', 'India', 'Delhi', 'New Delhi', 'Indira Gandhi International Airport', 'https://static1.mclcm.net/iod/images/v2/113/citytheque/localite_101_24/1200x630_100_300_000000x30x0.jpg'),
('DMK', 'Thailand', 'Bangkok', 'Don Mueang', 'Don Mueang International Airport', 'https://a.cdn-hotels.com/gdcs/production168/d707/c3156d7b-ce5a-4a5c-9a99-002b0ff57fe8.jpg'),
('DPS', 'Indonesia', 'Bali', 'Kabupaten Badung', 'BoNgurah Rai International Airportston Airport', 'https://imgcld.yatra.com/ytimages/image/upload/t_seo_Flight_w_768_h_380_c_fill_q_60_e_blur:10/c_fill,w_768,h_380,q_60,e_blur:10/v1504184402/Bali_airport.jpg'),
('HRI', 'Sri Lanka', 'Southern', 'Mattala', 'Mattala international airport', 'https://assets.traveltriangle.com/blog/wp-content/uploads/2019/08/Matale.jpg'),
('MAA', 'India', 'Tamil Nadu', 'Chennai', 'Chennai International Airport', 'https://upload.wikimedia.org/wikipedia/commons/3/32/Chennai_Central.jpg'),
('SIN', 'Singapore', 'Singapore', 'Singapore', 'Singapore Changi Airport', 'https://www.state.gov/wp-content/uploads/2019/04/Singpore-2560x1319.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `booking`
--

CREATE TABLE `booking` (
  `booking_id` varchar(255) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `user_id` int NOT NULL,
  `flight_id` int NOT NULL,
  `booked_date` datetime NOT NULL,
  `status` varchar(45) DEFAULT NULL,
  `count` int NOT NULL,
  `seat_class` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `booking`
--

INSERT INTO `booking` (`booking_id`, `amount`, `user_id`, `flight_id`, `booked_date`, `status`, `count`, `seat_class`) VALUES
('00c445a4-585c-46fe-8cb1-32d403c5dd72', '960.00', 25, 107, '2022-12-30 18:30:58', 'paid', 1, 'business'),
('064016f1-5b6c-42a2-94f2-e3b2f64138c0', '2280.00', 25, 116, '2022-12-31 18:51:27', 'paid', 2, 'business'),
('0661c969-98a2-43a0-b1e3-e06b38604bb0', '3381.98', 25, 112, '2022-12-31 18:42:45', 'paid', 2, 'platinum'),
('09ce8124-7f0d-4836-ac8f-1a47eba16d94', '600.00', 27, 101, '2022-12-30 18:33:59', 'paid', 2, 'economy'),
('0b72da3d-0aef-43a8-8595-fafae691f7c8', '840.00', 25, 113, '2022-12-31 18:44:37', 'paid', 2, 'economy'),
('0f642839-c0c4-4f89-a21d-06b29d0d9453', '720.00', 23, 127, '2022-12-31 18:14:40', 'paid', 2, 'economy'),
('1382b1bc-c21d-4269-b18f-25524e8c860e', '2376.69', 1, 77, '2022-12-28 18:38:47', 'paid', 2, 'platinum'),
('1409014e-46e0-43f7-b0e6-cc3d94324d44', '1400.00', 1, 70, '2022-12-28 18:31:00', 'paid', 1, 'platinum'),
('1690b8e1-60d0-4bdc-96a3-15025226a113', '1820.00', 1, 1, '2023-02-24 18:46:27', 'paid', 1, 'business'),
('1b70be07-9b0c-40b1-a3ab-0d358ed86b2a', '304.00', 27, 94, '2022-12-29 18:47:37', 'paid', 2, 'economy'),
('1cf870d8-bd59-47b8-9132-5ce64b10f4a2', '6460.00', 23, 88, '2022-12-29 18:31:51', 'paid', 2, 'platinum'),
('1d3c6311-9937-40d7-99ee-396d4e6e1a3b', '475.00', 23, 90, '2022-12-29 18:33:56', 'paid', 2, 'economy'),
('1ec27cf9-d1c1-46a8-97b5-5ad98be7a7cc', '3200.00', 23, 80, '2022-12-29 18:23:30', 'paid', 2, 'platinum'),
('22a26a12-5c4e-4f85-aa41-217a323c8bed', '1900.00', 1, 71, '2022-12-28 18:32:21', 'paid', 1, 'platinum'),
('268aa770-bb03-417b-a362-566bb35f9cff', '2280.00', 22, 126, '2022-12-31 18:37:51', 'paid', 2, 'platinum'),
('310617be-303d-461d-9a95-4a519d167993', '2660.00', 1, 73, '2022-12-28 18:35:23', 'paid', 2, 'platinum'),
('33bf4640-faf8-467c-b6e1-8e29cb3f8b5a', '1440.00', 1, 68, '2022-12-28 18:29:21', 'paid', 1, 'economy'),
('36d321d8-ceac-4a6d-9219-2b00dfa7f145', '3800.00', 1, 78, '2022-12-28 18:39:29', 'paid', 2, 'business'),
('37007eb4-52bf-40a4-a909-6cf27908c266', '5700.00', 23, 91, '2022-12-29 18:35:22', 'paid', 2, 'platinum'),
('3a78eed3-038b-403c-a651-bcdac97c33eb', '1140.00', 27, 104, '2022-12-30 18:41:52', 'paid', 2, 'economy'),
('3ab3ccb6-f686-492c-97b8-1db8bceca31f', '720.00', 27, 95, '2022-12-30 18:19:48', 'paid', 3, 'economy'),
('3f853cf9-2162-438d-adae-3a1acd57ee0c', '6000.00', 25, 114, '2022-12-31 18:46:35', 'paid', 2, 'platinum'),
('3fd18362-397e-4e34-8071-07626fa68c59', '1400.48', 23, 85, '2022-12-29 18:27:50', 'paid', 2, 'business'),
('3fd1b576-764a-4189-b07f-a7ee8509eb1a', '684.00', 27, 103, '2022-12-30 18:39:23', 'paid', 2, 'economy'),
('417ecd77-ba1d-4f50-a182-fa525e933918', '600.00', 25, 109, '2022-12-30 18:36:31', 'paid', 3, 'economy'),
('46f1fdec-46d5-4217-b83d-9effdf5711fb', '6000.00', 23, 114, '2022-12-31 18:13:31', 'paid', 2, 'platinum'),
('4a60a9f7-3ae6-4408-bb55-3df1ca0a6cb4', '2280.00', 22, 132, '2022-12-31 18:49:10', 'paid', 3, 'business'),
('4f87a83a-68a4-4f6d-a343-b2eeac465b2a', '4000.00', 22, 124, '2022-12-31 18:33:53', 'paid', 2, 'platinum'),
('51e30597-baf6-431b-97ff-88cb3390c6eb', '1440.00', 27, 96, '2022-12-30 18:24:22', 'paid', 3, 'economy'),
('54355bdb-3c86-4dab-8449-e0b2da79ca88', '399.00', 1, 72, '2022-12-28 18:34:04', 'paid', 1, 'economy'),
('57479ce4-7a0f-48f9-a866-4999a1ebb44e', '1020.00', 27, 97, '2022-12-30 18:27:45', 'paid', 2, 'economy'),
('5f7d4f0b-e11d-44ec-8628-a2b0547af5ae', '2660.00', 25, 118, '2022-12-31 18:54:11', 'paid', 2, 'platinum'),
('5fec27f4-f221-4a05-ae9a-adb749118cea', '2730.33', 25, 111, '2022-12-31 18:41:01', 'paid', 3, 'business'),
('627a8ae7-84d5-4419-a8d2-f5cd83f062d3', '1520.00', 23, 87, '2022-12-29 18:30:19', 'paid', 2, 'business'),
('6cf5a9af-a0d5-43ea-9f6b-ccd4729267c6', '1520.00', 22, 130, '2022-12-31 18:43:59', 'paid', 2, 'business'),
('7489dd8b-1977-4b26-ac97-5971e121bbbd', '1020.00', 27, 99, '2022-12-30 18:29:33', 'paid', 2, 'economy'),
('754d1ac6-0108-4e27-93ac-0e746b1e6dd8', '1995.00', 1, 72, '2022-12-28 18:33:32', 'paid', 1, 'platinum'),
('75e0e1e6-7065-4483-8fae-b47bb59fd33b', '600.00', 27, 82, '2022-12-29 18:07:59', 'paid', 1, 'economy'),
('76054198-110f-40c2-ab10-e66ab1ffff88', '456.00', 27, 102, '2022-12-30 18:36:44', 'paid', 3, 'economy'),
('7650f157-e308-47c0-87ae-e278f22044ce', '600.00', 27, 100, '2022-12-30 18:31:45', 'paid', 2, 'economy'),
('76ddc289-3bea-4057-a53e-2882413e1541', '798.00', 27, 93, '2022-12-29 18:46:13', 'paid', 2, 'economy'),
('79b5dd3d-474a-4489-8555-f942f512d9d0', '3400.00', 25, 108, '2022-12-30 18:34:14', 'paid', 2, 'platinum'),
('8235d050-c0c5-44e5-931b-b075259110be', '4000.00', 23, 75, '2022-12-28 18:11:36', 'paid', 2, 'business'),
('86d7a9f7-f1de-4f24-831d-2235c39ed25b', '1800.00', 22, 121, '2022-12-31 18:29:55', 'paid', 2, 'business'),
('87c44b07-944a-42ba-b192-746a66d77dc8', '285.00', 25, 117, '2022-12-31 18:52:50', 'paid', 1, 'economy'),
('8ce23ca3-33a7-4dd9-a572-2f59624946a3', '1260.00', 23, 115, '2022-12-31 18:09:38', 'paid', 2, 'economy'),
('8d1f5bef-aa7d-4684-8686-461194a6834e', '1342.22', 1, 69, '2022-12-28 18:29:52', 'paid', 1, 'platinum'),
('8dc52f91-7764-4b85-8459-572175287332', '200.00', 27, 109, '2022-12-30 18:12:02', 'paid', 1, 'economy'),
('8e140c60-fc05-4ce0-88a3-144a84550ea2', '360.00', 22, 106, '2022-12-30 18:17:46', 'paid', 2, 'economy'),
('90450bad-373d-49c4-85ae-f761d8c38f9e', '200.00', 27, 109, '2022-12-30 18:13:44', 'unpaid', 1, 'economy'),
('90e16a58-050c-40c4-9690-21d507c52bca', '6080.00', 1, 74, '2022-12-28 18:36:10', 'paid', 2, 'platinum'),
('92449e1e-fc65-43e2-8641-ac63dbb97f36', '2000.00', 22, 125, '2022-12-31 18:35:31', 'paid', 2, 'business'),
('9698ff46-3c94-4ee5-9a07-a9384cc258fb', '1140.00', 1, 76, '2022-12-28 18:37:36', 'paid', 2, 'economy'),
('9a051237-95e5-41b4-ba0d-0dab6b7b40c5', '1710.00', 23, 89, '2022-12-29 18:33:04', 'paid', 2, 'business'),
('9d2b11b6-cc73-4de4-ad82-824583c1c29b', '1310.40', 1, 2, '2023-02-25 04:33:57', 'paid', 1, 'platinum'),
('9e1ee810-dedc-4ea4-a409-8019193698a2', '4000.00', 22, 120, '2022-12-31 18:25:24', 'paid', 2, 'business'),
('a159e57b-2463-46a9-a0bb-0368ff370206', '1140.00', 22, 128, '2022-12-31 18:39:42', 'paid', 2, 'platinum'),
('a79dfe1f-5016-4236-b43f-f3fb49910d16', '1600.00', 22, 123, '2022-12-31 18:32:42', 'paid', 2, 'economy'),
('aaddbf86-adb1-4da8-923f-d0a166bcb9de', '798.00', 23, 6, '2023-01-14 02:54:43', 'unpaid', 2, 'economy'),
('ab164e28-6014-44ba-961f-bd8e70e5ffa4', '2880.00', 1, 2, '2023-01-13 13:38:20', 'paid', 2, 'economy'),
('b17a64c8-4876-4aea-9af0-410313eaffcb', '1440.00', 1, 2, '2023-01-13 07:14:11', 'paid', 1, 'economy'),
('b1cdda40-ef9a-4692-8a3f-c234d31907e9', '2000.00', 23, 81, '2022-12-29 18:24:59', 'paid', 2, 'business'),
('b1deddff-9bce-4680-ae2b-b9f84790ee9a', '1200.00', 1, 67, '2022-12-28 18:19:23', 'paid', 1, 'economy'),
('b338d996-61e3-4674-aeaa-36b1c62ad677', '660.00', 22, 122, '2022-12-31 18:31:31', 'paid', 1, 'economy'),
('b387d1a8-b1a4-4300-a247-6017aa17e9cf', '1310.40', 1, 2, '2023-02-24 18:29:32', 'paid', 1, 'economy'),
('b679a814-c3d6-4ee4-b70c-4fe331973c53', '3380.00', 23, 83, '2022-12-29 18:07:21', 'paid', 2, 'platinum'),
('b9b6e08d-3660-4a42-9b78-5df1082751be', '190.00', 1, 70, '2022-12-28 18:31:42', 'unpaid', 1, 'economy'),
('b9e7c052-152c-4e71-b6b7-27836b05d24b', '600.00', 23, 84, '2022-12-29 18:26:41', 'paid', 2, 'economy'),
('bb367ee2-8655-4f6e-aea6-1e59c6f0753e', '2730.00', 1, 1, '2023-02-25 04:49:06', 'paid', 1, 'platinum'),
('bde0aad0-e662-4a4d-a441-2e5443986aac', '1200.00', 1, 1, '2023-01-13 07:19:04', 'paid', 1, 'economy'),
('c0f8a8c1-7cf8-4aaa-bb28-e17085de7608', '1400.00', 23, 127, '2022-12-31 18:17:33', 'paid', 2, 'business'),
('c30787e9-e65c-447e-ac6f-7e1a0c50ca7d', '900.00', 22, 93, '2022-12-29 18:11:35', 'paid', 1, 'business'),
('c3fb5d03-0013-4fb8-959e-a2a6b75dd95e', '510.00', 27, 97, '2022-12-30 18:25:48', 'paid', 1, 'economy'),
('c9c1c0c6-4278-4f81-bd59-d1bed295866d', '320.00', 25, 110, '2022-12-31 18:38:23', 'paid', 2, 'economy'),
('cda2801e-59a9-4b42-a253-ff258ec522f0', '877.16', 1, 71, '2022-12-28 18:33:04', 'paid', 1, 'business'),
('ce2b9c32-e95c-4beb-b8dd-70af23716876', '1140.00', 27, 104, '2022-12-30 18:44:34', 'paid', 2, 'economy'),
('d6d50565-8617-43a4-a8ee-dcb50671eff5', '400.00', 27, 109, '2022-12-30 18:16:23', 'paid', 2, 'economy'),
('db3a07c8-a135-4308-948f-182bc634a871', '3581.74', 22, 119, '2022-12-31 18:23:38', 'paid', 2, 'platinum'),
('db776793-d407-4109-ac2d-1577ea9065ba', '855.00', 22, 131, '2022-12-31 18:46:35', 'paid', 2, 'economy'),
('dc8bc483-812a-4dd7-8b43-bdc1f91e58e8', '3200.00', 22, 80, '2022-12-29 18:09:22', 'paid', 2, 'platinum'),
('dd3fb3fd-ef72-41fe-baf5-9c65b4aef169', '570.00', 22, 129, '2022-12-31 18:42:37', 'paid', 2, 'economy'),
('ddca320a-dbc8-4e9d-901c-703cca261ee2', '360.00', 25, 106, '2022-12-30 18:28:48', 'paid', 2, 'economy'),
('dee58e79-471f-4c1c-b7ae-e6df9c38255e', '304.00', 23, 86, '2022-12-29 18:29:12', 'paid', 2, 'economy'),
('e9c68250-d64e-41cc-8f19-2f094183357b', '1440.00', 1, 69, '2022-12-28 18:30:31', 'paid', 2, 'business'),
('edab435e-76e2-47ad-8ab4-24786fed6778', '160.00', 1, 5, '2023-01-13 07:15:05', 'paid', 1, 'economy'),
('edbae785-2e92-4f2b-a1f3-f16841f3e049', '4560.00', 1, 79, '2022-12-28 18:40:29', 'paid', 3, 'platinum'),
('f2c5e462-eb3c-4c0d-bc0c-3f609242bb66', '570.00', 23, 92, '2022-12-29 18:36:20', 'paid', 2, 'economy'),
('f36587ea-7dca-40a3-9c7c-c6ffafbaf78e', '5692.02', 25, 115, '2022-12-31 18:48:45', 'paid', 3, 'business'),
('f4cdc60f-50f2-40d3-a61f-845da7af8e11', '1748.00', 22, 130, '2022-12-31 18:45:25', 'paid', 2, 'platinum'),
('fad8984f-1afc-4c72-8563-9b714e2fc281', '1221.42', 1, 3, '2023-02-24 18:34:20', 'paid', 1, 'platinum'),
('fd9f43d3-cf21-4d5f-a5c6-7d52b328c3df', '1440.00', 1, 68, '2022-12-28 18:25:22', 'paid', 1, 'economy');

--
-- Triggers `booking`
--
DELIMITER $$
CREATE TRIGGER `update_user_type` AFTER UPDATE ON `booking` FOR EACH ROW BEGIN
	IF ((select count(booking_id) as booking_count from booking where user_id=new.user_id and status='paid') >= 20) THEN
		update registerd_users 
        set user_type = "gold" where user_id = new.user_id ;
	ELSEIF ((select count(booking_id) as booking_count from booking where user_id=new.user_id and status='paid') >= 10 ) THEN
    update registerd_users 
        set user_type = "frequent" where user_id = new.user_id;
	END IF;
    END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `flights`
--

CREATE TABLE `flights` (
  `flight_id` int NOT NULL,
  `airplane_id` varchar(5) DEFAULT NULL,
  `route_id` int NOT NULL,
  `flightstatus_id` int NOT NULL,
  `departure_time` datetime NOT NULL,
  `arrival_time` datetime NOT NULL,
  `flight_no` varchar(45) DEFAULT NULL,
  `economy_fare` float DEFAULT NULL,
  `business_fare` float DEFAULT NULL,
  `platinum_fare` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `flights`
--

INSERT INTO `flights` (`flight_id`, `airplane_id`, `route_id`, `flightstatus_id`, `departure_time`, `arrival_time`, `flight_no`, `economy_fare`, `business_fare`, `platinum_fare`) VALUES
(1, 'A001', 1, 1, '2024-02-01 00:30:00', '2024-02-01 04:15:00', '1', 1200, 2000, 3000),
(2, 'A002', 2, 1, '2024-02-01 01:30:00', '2024-02-01 05:45:00', '2', 1440, 2245.55, 3433.25),
(3, 'A003', 3, 1, '2024-02-01 02:30:00', '2024-02-01 05:30:00', '3', 160, 720, 1342.22),
(4, 'A004', 4, 1, '2024-02-01 03:30:00', '2024-02-01 13:30:00', '4', 200, 800, 1400),
(5, 'A005', 5, 1, '2024-02-01 04:30:00', '2024-02-01 16:30:00', '5', 160, 923.33, 2000),
(6, 'A006', 6, 1, '2024-02-01 05:30:00', '2024-02-01 06:50:00', '6', 420, 1300, 2100),
(7, 'A007', 7, 1, '2024-02-01 06:30:00', '2024-02-01 08:10:00', '7', 200, 800, 1400),
(8, 'A008', 8, 2, '2024-02-01 07:30:00', '2024-02-01 08:50:00', '8', 1200, 2000, 3200),
(9, 'A008', 9, 1, '2024-02-02 00:30:00', '2024-02-02 04:00:00', '9', 1080, 2000, 3200),
(10, 'A007', 10, 1, '2024-02-02 01:30:00', '2024-02-02 02:10:00', '10', 600, 1000, 1800.45),
(11, 'A004', 11, 1, '2024-02-02 02:30:00', '2024-02-02 12:30:00', '11', 240, 850.36, 1250.89),
(12, 'A005', 12, 1, '2024-02-02 03:30:00', '2024-02-02 12:30:00', '12', 900, 2000, 3000),
(13, 'A006', 13, 1, '2024-02-02 04:30:00', '2024-02-02 09:30:00', '13', 360, 850, 1600),
(14, 'A001', 14, 1, '2024-02-02 05:30:00', '2024-02-02 07:30:00', '14', 360, 850, 1600),
(15, 'A002', 15, 1, '2024-02-02 06:30:00', '2024-02-02 14:00:00', '15', 480, 1000, 2000),
(16, 'A003', 16, 1, '2024-02-02 07:30:00', '2024-02-02 10:30:00', '16', 600, 1000, 1800),
(17, 'A001', 17, 1, '2024-02-03 00:30:01', '2024-02-03 03:30:00', '17', 510, 960, 1690),
(18, 'A002', 18, 1, '2024-02-03 01:30:00', '2024-02-03 05:30:00', '18', 300, 750, 1500),
(19, 'A003', 19, 1, '2024-02-03 02:30:00', '2024-02-03 07:30:00', '19', 300, 700.24, 1560.89),
(20, 'A004', 2, 1, '2024-02-03 03:30:00', '2024-02-03 07:45:00', '20', 160, 720, 1342.5),
(21, 'A005', 20, 1, '2024-02-03 04:30:00', '2024-02-03 07:00:00', '21', 360, 800, 1500),
(22, 'A006', 21, 1, '2024-02-03 05:30:00', '2024-02-03 08:00:00', '22', 1080, 2000, 3400),
(23, 'A007', 8, 1, '2024-02-03 06:30:00', '2024-02-03 07:50:00', '23', 480, 900, 1700),
(24, 'A008', 22, 1, '2024-02-03 07:30:00', '2024-02-03 10:30:00', '24', 250, 800, 1378.25),
(25, 'A001', 12, 1, '2024-02-04 00:30:00', '2024-02-04 09:30:00', '25', 918.79, 1992.11, 3000),
(26, 'A002', 11, 1, '2024-02-04 01:30:00', '2024-02-04 05:30:00', '26', 300, 723.33, 1350.55),
(27, 'A003', 14, 1, '2024-02-04 02:30:00', '2024-02-04 04:30:00', '27', 420, 900, 1500),
(28, 'A004', 15, 1, '2024-02-04 03:30:00', '2024-02-04 10:45:00', '28', 160, 720, 1342.22),
(29, 'A005', 23, 1, '2024-02-04 04:30:00', '2024-02-04 07:00:00', '29', 240, 850, 1250),
(30, 'A006', 24, 1, '2024-02-04 05:30:00', '2024-02-04 09:00:00', '30', 480, 900, 1700),
(31, 'A007', 6, 1, '2024-02-04 06:30:00', '2024-02-04 07:50:00', '31', 510, 960, 1690),
(32, 'A008', 13, 1, '2024-02-04 07:30:00', '2024-02-04 09:30:00', '32', 360, 700, 1350.55),
(33, 'A001', 25, 1, '2024-02-05 00:30:00', '2024-02-05 04:30:00', '33', 510, 1000, 1990.23),
(34, 'A002', 2, 1, '2024-02-05 01:30:00', '2024-02-05 06:00:00', '34', 300, 654.44, 1400),
(35, 'A003', 3, 1, '2024-02-05 02:30:00', '2024-02-05 05:30:00', '35', 300, 650, 1450.34),
(36, 'A004', 18, 1, '2024-02-05 03:30:00', '2024-02-05 07:45:00', '36', 160, 700, 1700),
(37, 'A005', 32, 1, '2024-02-05 04:30:00', '2024-02-05 07:00:00', '37', 360, 900, 1760),
(38, 'A006', 26, 1, '2024-02-05 05:30:00', '2024-02-05 08:00:00', '38', 600, 1000, 1934.44),
(39, 'A007', 13, 1, '2024-02-05 06:30:00', '2024-02-05 07:50:00', '39', 900, 2000, 3200),
(40, 'A008', 14, 1, '2024-02-05 07:30:00', '2024-02-05 10:30:00', '40', 180, 520, 1145.89),
(41, 'A001', 27, 1, '2024-02-06 00:30:00', '2024-02-06 05:30:00', '41', 510, 960, 1690),
(42, 'A002', 15, 1, '2024-02-06 01:30:00', '2024-02-06 09:00:00', '42', 420, 900, 1700),
(43, 'A003', 16, 1, '2024-02-06 02:30:00', '2024-02-06 04:00:00', '43', 200, 600, 1500),
(44, 'A004', 11, 1, '2024-02-06 03:30:00', '2024-02-06 07:45:00', '44', 160, 700, 1700),
(45, 'A005', 12, 1, '2024-02-06 04:30:00', '2024-02-06 08:00:00', '45', 480, 910.11, 1875.23),
(46, 'A006', 13, 1, '2024-02-06 05:30:00', '2024-02-06 07:00:00', '46', 400, 900, 1690.99),
(47, 'A007', 28, 1, '2024-02-06 06:30:00', '2024-02-06 07:50:00', '47', 420, 900, 1700),
(48, 'A008', 9, 1, '2024-02-06 07:30:00', '2024-02-06 11:30:00', '48', 1380, 2000, 3000),
(49, 'A001', 17, 1, '2024-02-07 00:30:00', '2024-02-07 04:00:00', '49', 630, 1897.34, 2500),
(50, 'A002', 18, 1, '2024-02-07 01:30:00', '2024-02-07 05:00:00', '50', 540, 1200, 1985.34),
(51, 'A003', 19, 1, '2024-02-07 02:30:00', '2024-02-07 14:00:00', '51', 300, 800, 1400),
(52, 'A004', 2, 1, '2024-02-07 03:30:00', '2024-02-07 08:45:00', '52', 280, 800, 1400),
(53, 'A005', 29, 1, '2024-02-07 04:30:00', '2024-02-07 09:00:00', '53', 480, 900.87, 1790.87),
(54, 'A006', 21, 1, '2024-02-07 05:30:00', '2024-02-07 08:00:00', '54', 1000, 2000, 3000),
(55, 'A007', 30, 1, '2024-02-07 06:30:00', '2024-02-07 08:50:00', '55', 480, 900, 1700),
(56, 'A008', 22, 1, '2024-02-07 07:30:00', '2024-02-07 11:30:00', '56', 660, 1000, 2000),
(57, 'A001', 12, 1, '2024-02-08 00:30:00', '2024-02-08 10:30:00', '57', 800, 1800, 3000),
(58, 'A002', 11, 1, '2024-02-08 01:30:00', '2024-02-08 05:30:00', '58', 540, 1000, 2000),
(59, 'A003', 14, 1, '2024-02-08 02:30:00', '2024-02-08 08:00:00', '59', 540, 1000, 2000),
(60, 'A004', 15, 1, '2024-02-08 03:30:00', '2024-02-08 10:45:00', '60', 280, 756.66, 1200),
(61, 'A005', 9, 1, '2024-02-08 04:30:00', '2024-02-08 09:00:00', '61', 360, 700, 1350),
(62, 'A006', 24, 1, '2024-02-08 05:30:00', '2024-02-08 10:00:00', '62', 400, 500, 600),
(63, 'A007', 31, 1, '2024-02-08 06:30:00', '2024-02-08 08:50:00', '63', 300, 450, 500),
(64, 'A008', 13, 1, '2024-02-08 07:30:00', '2024-02-08 10:30:00', '64', 700, 800, 920),
(65, 'A001', 1, 1, '2024-02-09 00:30:00', '2024-02-09 02:30:00', '65', 450, 850, 1400),
(66, 'A002', 2, 1, '2024-02-08 06:30:00', '2024-02-08 09:30:00', '66', 500, 800, 1200),
(67, 'A001', 1, 5, '2024-01-01 00:30:00', '2024-01-01 04:15:00', '1', 1200, 2000, 3000),
(68, 'A002', 2, 5, '2024-01-01 01:30:00', '2024-01-01 05:45:00', '2', 1440, 2245.55, 3433.25),
(69, 'A003', 3, 5, '2024-01-01 02:30:00', '2024-01-01 05:30:00', '3', 160, 720, 1342.22),
(70, 'A004', 4, 5, '2024-01-01 03:30:00', '2024-01-01 13:30:00', '4', 200, 800, 1400),
(71, 'A005', 5, 5, '2024-01-01 04:30:00', '2024-01-01 16:30:00', '5', 160, 923.33, 2000),
(72, 'A006', 6, 5, '2024-01-01 05:30:00', '2024-01-01 06:50:00', '6', 420, 1300, 2100),
(73, 'A007', 7, 5, '2024-01-01 06:30:00', '2024-01-01 08:10:00', '7', 200, 800, 1400),
(74, 'A008', 8, 5, '2024-01-01 07:30:00', '2024-01-01 08:50:00', '8', 1200, 2000, 3200),
(75, 'A008', 9, 5, '2024-01-02 00:30:00', '2024-01-02 04:00:00', '9', 1080, 2000, 3200),
(76, 'A007', 10, 5, '2024-01-02 01:30:00', '2024-01-02 02:10:00', '10', 600, 1000, 1800.45),
(77, 'A004', 11, 5, '2024-01-02 02:30:00', '2024-01-02 12:30:00', '11', 240, 850.36, 1250.89),
(78, 'A005', 12, 5, '2024-01-02 03:30:00', '2024-01-02 12:30:00', '12', 900, 2000, 3000),
(79, 'A006', 13, 5, '2024-01-02 04:30:00', '2024-01-02 09:30:00', '13', 360, 850, 1600),
(80, 'A001', 14, 5, '2024-01-02 05:30:00', '2024-01-02 07:30:00', '14', 360, 850, 1600),
(81, 'A002', 15, 5, '2024-01-02 06:30:00', '2024-01-02 14:00:00', '15', 480, 1000, 2000),
(82, 'A003', 16, 5, '2024-01-02 07:30:00', '2024-01-02 10:30:00', '16', 600, 1000, 1800),
(83, 'A001', 17, 5, '2024-01-03 00:30:01', '2024-01-03 03:30:00', '17', 510, 960, 1690),
(84, 'A002', 18, 5, '2024-01-03 01:30:00', '2024-01-03 05:30:00', '18', 300, 750, 1500),
(85, 'A003', 19, 5, '2024-01-03 02:30:00', '2024-01-03 07:30:00', '19', 300, 700.24, 1560.89),
(86, 'A004', 2, 5, '2024-01-03 03:30:00', '2024-01-03 07:45:00', '20', 160, 720, 1342.5),
(87, 'A005', 20, 5, '2024-01-03 04:30:00', '2024-01-03 07:00:00', '21', 360, 800, 1500),
(88, 'A006', 21, 5, '2024-01-03 05:30:00', '2024-01-03 08:00:00', '22', 1080, 2000, 3400),
(89, 'A007', 8, 5, '2024-01-03 06:30:00', '2024-01-03 07:50:00', '23', 480, 900, 1700),
(90, 'A008', 22, 5, '2024-01-03 07:30:00', '2024-01-03 10:30:00', '24', 250, 800, 1378.25),
(91, 'A001', 12, 5, '2024-01-04 00:30:00', '2024-01-04 09:30:00', '25', 918.79, 1992.11, 3000),
(92, 'A002', 11, 5, '2024-01-04 01:30:00', '2024-01-04 05:30:00', '26', 300, 723.33, 1350.55),
(93, 'A003', 14, 5, '2024-01-04 02:30:00', '2024-01-04 04:30:00', '27', 420, 900, 1500),
(94, 'A004', 15, 5, '2024-01-04 03:30:00', '2024-01-04 10:45:00', '28', 160, 720, 1342.22),
(95, 'A005', 23, 5, '2024-01-04 04:30:00', '2024-01-04 07:00:00', '29', 240, 850, 1250),
(96, 'A006', 24, 5, '2024-01-04 05:30:00', '2024-01-04 09:00:00', '30', 480, 900, 1700),
(97, 'A007', 6, 5, '2024-01-04 06:30:00', '2024-01-04 07:50:00', '31', 510, 960, 1690),
(98, 'A008', 13, 5, '2024-01-04 07:30:00', '2024-01-04 09:30:00', '32', 360, 700, 1350.55),
(99, 'A001', 25, 5, '2024-01-05 00:30:00', '2024-01-05 04:30:00', '33', 510, 1000, 1990.23),
(100, 'A002', 2, 5, '2024-01-05 01:30:00', '2024-01-05 06:00:00', '34', 300, 654.44, 1400),
(101, 'A003', 3, 5, '2024-01-05 02:30:00', '2024-01-05 05:30:00', '35', 300, 650, 1450.34),
(102, 'A004', 18, 5, '2024-01-05 03:30:00', '2024-01-05 07:45:00', '36', 160, 700, 1700),
(103, 'A005', 32, 5, '2024-01-05 04:30:00', '2024-01-05 07:00:00', '37', 360, 900, 1760),
(104, 'A006', 26, 5, '2024-01-05 05:30:00', '2024-01-05 08:00:00', '38', 600, 1000, 1934.44),
(105, 'A007', 13, 5, '2024-01-05 06:30:00', '2024-01-05 07:50:00', '39', 900, 2000, 3200),
(106, 'A008', 14, 5, '2024-01-05 07:30:00', '2024-01-05 10:30:00', '40', 180, 520, 1145.89),
(107, 'A001', 27, 5, '2024-01-06 00:30:00', '2024-01-06 05:30:00', '41', 510, 960, 1690),
(108, 'A002', 15, 5, '2024-01-06 01:30:00', '2024-01-06 09:00:00', '42', 420, 900, 1700),
(109, 'A003', 16, 5, '2024-01-06 02:30:00', '2024-01-06 04:00:00', '43', 200, 600, 1500),
(110, 'A004', 11, 5, '2024-01-06 03:30:00', '2024-01-06 07:45:00', '44', 160, 700, 1700),
(111, 'A005', 12, 5, '2024-01-06 04:30:00', '2024-01-06 08:00:00', '45', 480, 910.11, 1875.23),
(112, 'A006', 13, 5, '2024-01-06 05:30:00', '2024-01-06 07:00:00', '46', 400, 900, 1690.99),
(113, 'A007', 28, 5, '2024-01-06 06:30:00', '2024-01-06 07:50:00', '47', 420, 900, 1700),
(114, 'A008', 9, 5, '2024-01-06 07:30:00', '2024-01-06 11:30:00', '48', 1380, 2000, 3000),
(115, 'A001', 17, 5, '2024-01-07 00:30:00', '2024-01-07 04:00:00', '49', 630, 1897.34, 2500),
(116, 'A002', 18, 5, '2024-01-07 01:30:00', '2024-01-07 05:00:00', '50', 540, 1200, 1985.34),
(117, 'A003', 19, 5, '2024-01-07 02:30:00', '2024-01-07 14:00:00', '51', 300, 800, 1400),
(118, 'A004', 2, 5, '2024-01-07 03:30:00', '2024-01-07 08:45:00', '52', 280, 800, 1400),
(119, 'A005', 29, 5, '2024-01-07 04:30:00', '2024-01-07 09:00:00', '53', 480, 900.87, 1790.87),
(120, 'A006', 21, 5, '2024-01-07 05:30:00', '2024-01-07 08:00:00', '54', 1000, 2000, 3000),
(121, 'A007', 30, 5, '2024-01-07 06:30:00', '2024-01-07 08:50:00', '55', 480, 900, 1700),
(122, 'A008', 22, 5, '2024-01-07 07:30:00', '2024-01-07 11:30:00', '56', 660, 1000, 2000),
(123, 'A001', 12, 5, '2024-01-08 00:30:00', '2024-01-08 10:30:00', '57', 800, 1800, 3000),
(124, 'A002', 11, 5, '2024-01-08 01:30:00', '2024-01-08 05:30:00', '58', 540, 1000, 2000),
(125, 'A003', 14, 5, '2024-01-08 02:30:00', '2024-01-08 08:00:00', '59', 540, 1000, 2000),
(126, 'A004', 15, 5, '2024-01-08 03:30:00', '2024-01-08 10:45:00', '60', 280, 756.66, 1200),
(127, 'A005', 9, 5, '2024-01-08 04:30:00', '2024-01-08 09:00:00', '61', 360, 700, 1350),
(128, 'A006', 24, 5, '2024-01-08 05:30:00', '2024-01-08 10:00:00', '62', 400, 500, 600),
(129, 'A007', 31, 5, '2024-01-08 06:30:00', '2024-01-08 08:50:00', '63', 300, 450, 500),
(130, 'A008', 13, 5, '2024-01-08 07:30:00', '2024-01-08 10:30:00', '64', 700, 800, 920),
(131, 'A001', 1, 5, '2024-01-09 00:30:00', '2024-01-09 02:30:00', '65', 450, 850, 1400),
(132, 'A002', 2, 5, '2024-01-08 06:30:00', '2024-01-08 09:30:00', '66', 500, 800, 1200);

-- --------------------------------------------------------

--
-- Table structure for table `flight_status`
--

CREATE TABLE `flight_status` (
  `flightstatus_id` int NOT NULL,
  `status` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `flight_status`
--

INSERT INTO `flight_status` (`flightstatus_id`, `status`) VALUES
(1, 'Scheduled'),
(2, 'Delayed'),
(3, 'Departed'),
(4, 'In Air'),
(5, 'Landed'),
(6, 'Cancelled');

-- --------------------------------------------------------

--
-- Table structure for table `passenger`
--

CREATE TABLE `passenger` (
  `passenger_name` varchar(255) NOT NULL,
  `passport_number` varchar(50) NOT NULL,
  `dob` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `passenger`
--

INSERT INTO `passenger` (`passenger_name`, `passport_number`, `dob`) VALUES
('Salman Khan', '1234687HF', '1981-11-09'),
('Bernard Cowan', '132425242I', '2007-11-14'),
('Ronald France', '132425242T', '1993-06-15'),
('Betty Rose', '16123481D', '2013-12-13'),
('Jack Creley', '16136441D', '2000-03-04'),
('Len Carlson', '311234324L', '2008-03-25'),
('Chris Wiggins', '314212341K', '1990-12-16'),
('Sandy Becker', '32152147J', '1993-12-14'),
('Henry Ramer', '32w33117J', '2009-12-16'),
('John Vernon', '91633481H', '2006-05-30'),
('Bruce Banner', '98123481A', '1996-06-14'),
('Peter parker', '98212481H', '2010-01-31'),
('Scarlett Johansson', '98213481H', '2000-04-05'),
('Vicky Kaushal', '9879862PQ', '2006-01-04'),
('will robinson', 'A112250', '1996-12-08'),
('robinson will', 'A112251', '2008-02-01'),
('Mr. Fantastic', 'A23141287243', '1889-11-28'),
('Sangaran', 'A25416136', '2000-11-10'),
('john west', 'A758412', '1988-10-11'),
('penny robinson', 'A758574', '2000-05-06'),
('Kumar', 'B09123858', '2004-01-04'),
('ben tennyson', 'B100258', '2000-10-12'),
('sai hope', 'C141215', '2009-06-06'),
('vijay vasanth', 'D112255', '1990-05-25'),
('Sathvee', 'D23512526', '2000-03-08'),
('lokesh kanakaraj', 'D585769', '2009-02-01'),
('vasanth vijay', 'D887788', '2008-01-13'),
('Saranyan', 'E123012310', '2007-02-03'),
('joe smith', 'E445565', '1968-03-22'),
('steve smith', 'E787741', '1996-07-08'),
('HArish', 'G0932422', '2000-01-22'),
('Jude Aarththi', 'G09713543', '2018-01-05'),
('Lithursan Murugan', 'G09723322', '1992-01-17'),
('Sivarasa Kajan', 'G09723521', '1999-12-04'),
('Jathursan Jathu', 'G09723522', '2017-01-25'),
('Ratnam Kumar', 'G09723543', '2010-03-12'),
('Ratnam Kamal', 'G09743543', '1998-06-24'),
('Ratnam Kobal', 'G09786123', '2016-02-01'),
('Sivarasa Kajan', 'G09786512', '2008-12-12'),
('Sivarasa Nimal', 'G09786513', '2000-12-31'),
('Kobinarth', 'G09786543', '2000-06-22'),
('Athavan Aathi', 'G09786763', '2014-12-05'),
('Henry', 'G12308320', '2000-01-03'),
('Nick Fury', 'G23215312358', '2006-09-27'),
('gwen tennyson', 'G458562', '2002-02-26'),
('Ronald France', 'G8q7343211', '2009-01-14'),
('Jack Creley', 'G8q7349812', '2000-09-14'),
('peter parker', 'H009008', '2003-05-14'),
('Nirosan', 'H0932340', '2023-01-01'),
('Keeran', 'H2138329', '2000-09-14'),
('Thineshan', 'H23489234', '2023-01-01'),
('Kobinarth', 'H2349223', '2023-01-01'),
('Kelen', 'H23923242', '2003-01-08'),
('Vicky Kaushal', 'H2743598L', '1999-01-03'),
('Hrithik Roshan', 'H7189175I', '2010-02-08'),
('micheal jackson', 'H7744558', '2000-12-12'),
('jackson micheal', 'H7744559', '1998-12-05'),
('Parivelan', 'I234239230', '2003-01-03'),
('nallini', 'I554554', '2010-03-30'),
('devi kumar', 'I778778', '1990-12-29'),
('bil gates', 'I778844', '2010-10-05'),
('Joern', 'J0132123', '2001-04-02'),
('Joel', 'J091231', '2000-03-02'),
('Kumar', 'J09234201', '2009-02-03'),
('Majinu', 'J09786543', '1991-05-23'),
('Karan Joe', 'j1291230', '2000-01-02'),
('Liku', 'J2103921', '2001-02-03'),
('Manjula', 'J213781230', '2005-02-03'),
('Vijay', 'K02423920', '2001-02-03'),
('Arthi', 'K0912301', '2009-02-03'),
('Samanatha', 'K0942023', '1999-02-03'),
('Nithu', 'K0942309', '2001-02-03'),
('Sri Pathy', 'K09723543', '2014-05-06'),
('Rahavai', 'K123012', '2007-02-03'),
('Vaani', 'K1231290', '2006-03-03'),
('Thamilizai', 'K1238912', '2007-02-03'),
('Tharan Panchalingam', 'K1239101', '2001-04-03'),
('Franklin', 'K12391201', '2003-01-03'),
('Hiruni', 'K2012310', '2007-02-03'),
('uthayanithi stalin', 'K442001', '2016-02-02'),
('kevin eleven', 'K461928', '1999-05-15'),
('john parker', 'K520255', '2011-10-13'),
('maanick baasha', 'K587121', '2009-12-10'),
('Luke Cage', 'K78162587', '2008-09-30'),
('Vita Linder', 'K928459167', '1997-04-19'),
('Jude ', 'kamal', '2009-12-12'),
('Ravi Jathu', 'L09723521', '1976-03-04'),
('Wayambu', 'L09786512', '1990-12-31'),
('vikram kumar', 'L452145', '2006-01-02'),
('Jessica Jones', 'L732648KK', '1988-08-17'),
('Tony Stark', 'L928412391', '2011-04-19'),
('Rajini Kanth', 'M09236543', '1993-02-02'),
('Sri Athavan', 'M09326543', '2017-12-07'),
('Nimal Nimalan', 'M09723521', '2000-02-03'),
('Vijay Kumar', 'M09786123', '2000-12-12'),
('Kadampan Leela', 'M09786432', '2018-01-13'),
('Suyambu', 'M09786512', '2016-12-12'),
('Jude Aarangan', 'M09786513', '1987-09-26'),
('Lithursan Sivam', 'M09786521', '2017-01-10'),
('kamal kasan', 'M09786543', '2009-06-10'),
('Kadampan Viruman', 'M09786765', '1999-01-05'),
('Mani Likku', 'M09786768', '2000-12-23'),
('jane smith', 'M457824', '2000-12-08'),
('narendra modi', 'N285412', '1960-10-10'),
('Shivin', 'N43884334', '2010-09-26'),
('Uththara', 'N57549855', '2007-06-07'),
('Kaarunya', 'N783483488', '2000-05-31'),
('Sana', 'N8344838', '2010-08-05'),
('Billie', 'N8348383', '2004-05-27'),
('Aarthi', 'N834932833', '2018-06-07'),
('Hamsha', 'N83838833', '1997-08-06'),
('Moochi', 'N84378434', '1999-03-08'),
('Kathrine', 'N84383485', '2006-03-04'),
('Jennie', 'N84384384', '2006-03-04'),
('Namjoon', 'N8458384', '1989-08-07'),
('Hope', 'N845858484', '2000-03-07'),
('RM', 'N84884722', '1994-12-09'),
('Jimin', 'N849343373', '2010-10-13'),
('Paira', 'N849343433', '2000-02-11'),
('Suga', 'N849389493', '2015-04-05'),
('Tae', 'N84948339', '2012-12-30'),
('Kai', 'N8499848', '1995-04-03'),
('Kim', 'N8548598', '2012-04-05'),
('Lilly', 'N8548848', '2008-05-20'),
('Delax', 'N8735484', '2009-05-05'),
('Min Yoongi', 'N87458743', '2000-08-09'),
('Rose', 'N8758548', '2000-07-06'),
('Jungkook', 'N894389839', '1995-03-31'),
('Lisa', 'N9439898', '2010-06-20'),
('Aishu', 'N9493494', '2009-06-07'),
('Pavi', 'N9843985', '1990-05-04'),
('Benjamin', 'P09234320', '2007-02-03'),
('Laila', 'P09723521', '2000-12-14'),
('Ratnam gogul', 'P09786543', '2000-08-25'),
('Nalayin', 'P12308922', '2006-02-05'),
('Dulquer Salmaan', 'P145279UU', '1984-01-05'),
('rajesh krish', 'P177585', '1979-11-11'),
('Fazar', 'P23492348', '1984-01-05'),
('Ajith', 'P23782921', '2006-02-03'),
('utthaman villan', 'P4475520', '2005-02-11'),
('Fahad', 'P7825687AG', '2016-01-12'),
('Sachiin Joshi', 'PP82781722', '1988-05-03'),
('Sri Mathavan', 'Q09786512', '1999-01-25'),
('harris jayaraj', 'Q455545', '2009-12-08'),
('Gambit', 'R23235818P', '2013-07-07'),
('Silver Surfer', 'R23817819U', '1991-03-01'),
('sinaraasu sooriyakumar', 'S143457', '1987-10-10'),
('aadithya arunachalam', 'SS77854', '1950-12-12'),
('Venthan', 'T09123011', '2008-08-03'),
('Ratnam Raja', 'T09786543', '1992-01-09'),
('pooja kumar', 'T202018', '2008-10-10'),
('Wanda Vision', 'T891287916', '2009-02-22'),
('Monique Miller', 'T892379791', '1998-02-04'),
('Arjun Kapoor', 'TE81625816', '2009-11-02'),
('Mammootty', 'U785848QH', '2009-01-11'),
('Amar', 'V09231230', '2004-02-04'),
('jury rigg', 'V101010', '2013-10-25'),
('jessica harris', 'W123454', '2003-12-11'),
('Mohanlal', 'Y8625878UU', '1999-01-03');

-- --------------------------------------------------------

--
-- Stand-in structure for view `passenger_flight_details`
-- (See below for the actual view)
--
CREATE TABLE `passenger_flight_details` (
`dob` date
,`flight_id` int
,`flight_no` varchar(45)
,`passenger_name` varchar(255)
,`passport_number` varchar(50)
);

-- --------------------------------------------------------

--
-- Table structure for table `registerd_users`
--

CREATE TABLE `registerd_users` (
  `user_id` int NOT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone_number` varchar(10) DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `NIC` varchar(12) DEFAULT NULL,
  `user_type` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `registerd_users`
--

INSERT INTO `registerd_users` (`user_id`, `first_name`, `last_name`, `password`, `email`, `phone_number`, `gender`, `dob`, `NIC`, `user_type`) VALUES
(1, 'Kobinarth', 'Panchalingam', 'Itsme043', 'root@gmail.com', '0775694740', 'male', '2023-01-12', '200017400402', 'gold'),
(21, 'asdg', 'hfdjhda', 'sathb@lkH231', 'fgsd@gmail.com', '1243467845', 'male', '2023-01-03', '200003146879', 'normal'),
(22, 'Sanujen', 'Premkumar', 'sanujen29', 'sanuprem6@gmail.com', '0758528933', 'male', '2000-07-29', '200024587224', 'frequent'),
(23, 'Sathveegan', 'Yogendrarajah', 'sathvee123', 'ysathu8@gmail.com', '0764986321', 'male', '2000-03-08', '200003146872', 'frequent'),
(24, 'si', 'Kajan', 'Qnhiudb2gh3n', 'sivanisa@gmail.com', '0760022990', 'male', '2000-03-25', '200008500395', 'normal'),
(25, 'Pairavi', 'Thanancheyan', 'dfjdfdf', 'paira@gmail.com', '0774464523', 'female', '2000-11-02', '200087564372', 'frequent'),
(27, 'Sivarasa', 'Nisanthan', 'South@2019', 'sivanisanthan2503@gmail.com', '0760022992', 'male', '2000-03-25', '200008400395', 'frequent'),
(28, 'Mathusha', 'Sivaananthan', 'Mathu2k#2000', 'mathushasiva2k@gmail.com', '0772956568', 'female', '2000-01-01', '200050100891', 'normal');

-- --------------------------------------------------------

--
-- Table structure for table `route`
--

CREATE TABLE `route` (
  `route_id` int NOT NULL DEFAULT '0',
  `origin` varchar(3) NOT NULL,
  `destination` varchar(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `route`
--

INSERT INTO `route` (`route_id`, `origin`, `destination`) VALUES
(17, 'BIA', 'BOM'),
(35, 'BIA', 'CGK'),
(9, 'BIA', 'DEL'),
(6, 'BIA', 'MAA'),
(3, 'BIA', 'SIN'),
(14, 'BKK', 'BIA'),
(21, 'BKK', 'HRI'),
(28, 'BKK', 'MAA'),
(19, 'BOM', 'BKK'),
(12, 'BOM', 'CGK'),
(39, 'BOM', 'DMK'),
(26, 'BOM', 'MAA'),
(29, 'CGK', 'BIA'),
(1, 'CGK', 'BKK'),
(4, 'CGK', 'DEL'),
(33, 'CGK', 'DPS'),
(25, 'CGK', 'HRI'),
(20, 'CGK', 'SIN'),
(37, 'DEL', 'BKK'),
(32, 'DEL', 'BOM'),
(11, 'DEL', 'DPS'),
(22, 'DEL', 'MAA'),
(38, 'DEL', 'SIN'),
(15, 'DMK', 'HRI'),
(34, 'DPS', 'BIA'),
(5, 'DPS', 'BOM'),
(2, 'DPS', 'DMK'),
(27, 'HRI', 'BIA'),
(36, 'HRI', 'BKK'),
(24, 'HRI', 'BOM'),
(18, 'HRI', 'DEL'),
(10, 'HRI', 'MAA'),
(8, 'MAA', 'BIA'),
(13, 'MAA', 'BKK'),
(40, 'MAA', 'DEL'),
(7, 'MAA', 'HRI'),
(30, 'MAA', 'SIN'),
(16, 'SIN', 'BOM'),
(23, 'SIN', 'DEL'),
(31, 'SIN', 'MAA');

-- --------------------------------------------------------

--
-- Stand-in structure for view `seat_details`
-- (See below for the actual view)
--
CREATE TABLE `seat_details` (
`airplane_id` varchar(5)
,`business_seatcapacity` int
,`economy_seatcapacity` int
,`flight_id` int
,`platinum_seatcapacity` int
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `shedule`
-- (See below for the actual view)
--
CREATE TABLE `shedule` (
`airplane_id` varchar(5)
,`arrival_time` datetime
,`business_fare` float
,`departure_time` datetime
,`destination` varchar(3)
,`economy_fare` float
,`flight_id` int
,`flight_no` varchar(45)
,`image_url` varchar(1000)
,`origin` varchar(3)
,`platinum_fare` float
,`route_id` int
,`status` varchar(255)
);

-- --------------------------------------------------------

--
-- Table structure for table `ticket`
--

CREATE TABLE `ticket` (
  `ticket_id` int NOT NULL,
  `seat_no` int DEFAULT NULL,
  `passport_number` varchar(50) NOT NULL,
  `booking_id` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `ticket`
--

INSERT INTO `ticket` (`ticket_id`, `seat_no`, `passport_number`, `booking_id`) VALUES
(101, 37, 'H23489234', 'b17a64c8-4876-4aea-9af0-410313eaffcb'),
(102, 45, 'H2349223', 'edab435e-76e2-47ad-8ab4-24786fed6778'),
(103, 69, 'H0932340', 'bde0aad0-e662-4a4d-a441-2e5443986aac'),
(104, 45, 'G09786543', 'ab164e28-6014-44ba-961f-bd8e70e5ffa4'),
(105, 39, 'H23489234', 'ab164e28-6014-44ba-961f-bd8e70e5ffa4'),
(106, 1, '98212481H', 'b679a814-c3d6-4ee4-b70c-4fe331973c53'),
(107, 6, '98213481H', 'b679a814-c3d6-4ee4-b70c-4fe331973c53'),
(108, 39, 'G09786543', '75e0e1e6-7065-4483-8fae-b47bb59fd33b'),
(109, 71, '16123481D', '8ce23ca3-33a7-4dd9-a572-2f59624946a3'),
(110, 69, '98123481A', '8ce23ca3-33a7-4dd9-a572-2f59624946a3'),
(111, 2, 'H7744559', 'dc8bc483-812a-4dd7-8b43-bdc1f91e58e8'),
(112, 1, 'H7744558', 'dc8bc483-812a-4dd7-8b43-bdc1f91e58e8'),
(113, 14, '91633481H', '8235d050-c0c5-44e5-931b-b075259110be'),
(114, 13, '16136441D', '8235d050-c0c5-44e5-931b-b075259110be'),
(115, 13, 'I778844', 'c30787e9-e65c-447e-ac6f-7e1a0c50ca7d'),
(116, 47, 'kamal', '8dc52f91-7764-4b85-8459-572175287332'),
(117, 2, '32w33117J', '46f1fdec-46d5-4217-b83d-9effdf5711fb'),
(118, 1, '32152147J', '46f1fdec-46d5-4217-b83d-9effdf5711fb'),
(119, 46, 'G09786543', '90450bad-373d-49c4-85ae-f761d8c38f9e'),
(120, 50, '311234324L', '0f642839-c0c4-4f89-a21d-06b29d0d9453'),
(121, 45, '314212341K', '0f642839-c0c4-4f89-a21d-06b29d0d9453'),
(122, 59, 'G09786513', 'd6d50565-8617-43a4-a8ee-dcb50671eff5'),
(123, 53, 'G09786512', 'd6d50565-8617-43a4-a8ee-dcb50671eff5'),
(124, 14, '132425242I', 'c0f8a8c1-7cf8-4aaa-bb28-e17085de7608'),
(125, 13, '132425242T', 'c0f8a8c1-7cf8-4aaa-bb28-e17085de7608'),
(126, 46, 'D887788', '8e140c60-fc05-4ce0-88a3-144a84550ea2'),
(127, 45, 'D112255', '8e140c60-fc05-4ce0-88a3-144a84550ea2'),
(128, 69, 'G12308320', 'b1deddff-9bce-4680-ae2b-b9f84790ee9a'),
(129, 47, 'P09786543', '3ab3ccb6-f686-492c-97b8-1db8bceca31f'),
(130, 46, 'G09743543', '3ab3ccb6-f686-492c-97b8-1db8bceca31f'),
(131, 45, 'G09723543', '3ab3ccb6-f686-492c-97b8-1db8bceca31f'),
(132, 12, 'G8q7343211', '1ec27cf9-d1c1-46a8-97b5-5ad98be7a7cc'),
(133, 6, 'G8q7349812', '1ec27cf9-d1c1-46a8-97b5-5ad98be7a7cc'),
(134, 6, 'A112251', 'db3a07c8-a135-4308-948f-182bc634a871'),
(135, 5, 'A112250', 'db3a07c8-a135-4308-948f-182bc634a871'),
(136, 67, 'M09786123', '51e30597-baf6-431b-97ff-88cb3390c6eb'),
(137, 61, 'M09236543', '51e30597-baf6-431b-97ff-88cb3390c6eb'),
(138, 62, 'M09786543', '51e30597-baf6-431b-97ff-88cb3390c6eb'),
(139, 15, 'T891287916', 'b1cdda40-ef9a-4692-8a3f-c234d31907e9'),
(140, 13, 'T892379791', 'b1cdda40-ef9a-4692-8a3f-c234d31907e9'),
(141, 15, 'A758412', '9e1ee810-dedc-4ea4-a409-8019193698a2'),
(142, 14, 'A758574', '9e1ee810-dedc-4ea4-a409-8019193698a2'),
(143, 38, 'G0932422', 'fd9f43d3-cf21-4d5f-a5c6-7d52b328c3df'),
(144, 71, 'G09723521', 'c3fb5d03-0013-4fb8-959e-a2a6b75dd95e'),
(145, 38, 'L928412391', 'b9e7c052-152c-4e71-b6b7-27836b05d24b'),
(146, 37, 'K928459167', 'b9e7c052-152c-4e71-b6b7-27836b05d24b'),
(147, 20, 'R23235818P', '3fd18362-397e-4e34-8071-07626fa68c59'),
(148, 14, 'R23817819U', '3fd18362-397e-4e34-8071-07626fa68c59'),
(150, 98, 'L09723521', '57479ce4-7a0f-48f9-a866-4999a1ebb44e'),
(151, 97, 'K09723543', '57479ce4-7a0f-48f9-a866-4999a1ebb44e'),
(152, 49, 'N83838833', 'ddca320a-dbc8-4e9d-901c-703cca261ee2'),
(153, 48, 'N849343433', 'ddca320a-dbc8-4e9d-901c-703cca261ee2'),
(154, 41, 'G23215312358', 'dee58e79-471f-4c1c-b7ae-e6df9c38255e'),
(155, 42, 'A23141287243', 'dee58e79-471f-4c1c-b7ae-e6df9c38255e'),
(156, 41, 'P23492348', '33bf4640-faf8-467c-b6e1-8e29cb3f8b5a'),
(157, 113, 'G09723322', '7489dd8b-1977-4b26-ac97-5971e121bbbd'),
(158, 114, 'M09786521', '7489dd8b-1977-4b26-ac97-5971e121bbbd'),
(159, 4, 'J213781230', '8d1f5bef-aa7d-4684-8686-461194a6834e'),
(160, 19, 'Q455545', '86d7a9f7-f1de-4f24-831d-2235c39ed25b'),
(161, 13, 'W123454', '86d7a9f7-f1de-4f24-831d-2235c39ed25b'),
(162, 14, 'K78162587', '627a8ae7-84d5-4419-a8d2-f5cd83f062d3'),
(163, 15, 'L732648KK', '627a8ae7-84d5-4419-a8d2-f5cd83f062d3'),
(164, 14, 'K1231290', 'e9c68250-d64e-41cc-8f19-2f094183357b'),
(165, 13, 'H2138329', 'e9c68250-d64e-41cc-8f19-2f094183357b'),
(166, 5, 'J2103921', '1409014e-46e0-43f7-b0e6-cc3d94324d44'),
(167, 35, 'N849343373', '00c445a4-585c-46fe-8cb1-32d403c5dd72'),
(168, 60, 'E445565', 'b338d996-61e3-4674-aeaa-36b1c62ad677'),
(169, 42, 'K0942309', 'b9b6e08d-3660-4a42-9b78-5df1082751be'),
(170, 4, 'TE81625816', '1cf870d8-bd59-47b8-9132-5ce64b10f4a2'),
(171, 3, 'PP82781722', '1cf870d8-bd59-47b8-9132-5ce64b10f4a2'),
(172, 90, 'G09723522', '7650f157-e308-47c0-87ae-e278f22044ce'),
(173, 89, 'M09723521', '7650f157-e308-47c0-87ae-e278f22044ce'),
(174, 12, 'K1238912', '22a26a12-5c4e-4f85-aa41-217a323c8bed'),
(175, 76, 'I554554', 'a79dfe1f-5016-4236-b43f-f3fb49910d16'),
(176, 70, 'I778778', 'a79dfe1f-5016-4236-b43f-f3fb49910d16'),
(177, 15, 'K123012', 'cda2801e-59a9-4b42-a253-ff258ec522f0'),
(178, 16, '9879862PQ', '9a051237-95e5-41b4-ba0d-0dab6b7b40c5'),
(179, 15, '1234687HF', '9a051237-95e5-41b4-ba0d-0dab6b7b40c5'),
(180, 3, 'K0912301', '754d1ac6-0108-4e27-93ac-0e746b1e6dd8'),
(181, 4, 'K520255', '4f87a83a-68a4-4f6d-a343-b2eeac465b2a'),
(182, 3, 'H009008', '4f87a83a-68a4-4f6d-a343-b2eeac465b2a'),
(183, 47, 'H7189175I', '1d3c6311-9937-40d7-99ee-396d4e6e1a3b'),
(184, 48, 'H2743598L', '1d3c6311-9937-40d7-99ee-396d4e6e1a3b'),
(185, 42, 'G09786123', '09ce8124-7f0d-4836-ac8f-1a47eba16d94'),
(186, 41, 'T09786543', '09ce8124-7f0d-4836-ac8f-1a47eba16d94'),
(187, 45, 'E123012310', '54355bdb-3c86-4dab-8449-e0b2da79ca88'),
(188, 10, 'N84948339', '79b5dd3d-474a-4489-8555-f942f512d9d0'),
(189, 9, 'N84884722', '79b5dd3d-474a-4489-8555-f942f512d9d0'),
(190, 1, 'U785848QH', '37007eb4-52bf-40a4-a909-6cf27908c266'),
(191, 2, 'P145279UU', '37007eb4-52bf-40a4-a909-6cf27908c266'),
(192, 4, 'H23923242', '310617be-303d-461d-9a95-4a519d167993'),
(193, 3, 'V09231230', '310617be-303d-461d-9a95-4a519d167993'),
(194, 22, 'M457824', '92449e1e-fc65-43e2-8641-ac63dbb97f36'),
(195, 21, 'V101010', '92449e1e-fc65-43e2-8641-ac63dbb97f36'),
(196, 12, 'K12391201', '90e16a58-050c-40c4-9690-21d507c52bca'),
(197, 11, 'P09234320', '90e16a58-050c-40c4-9690-21d507c52bca'),
(198, 40, 'P7825687AG', 'f2c5e462-eb3c-4c0d-bc0c-3f609242bb66'),
(199, 39, 'Y8625878UU', 'f2c5e462-eb3c-4c0d-bc0c-3f609242bb66'),
(200, 57, 'N894389839', '417ecd77-ba1d-4f50-a182-fa525e933918'),
(201, 55, 'N849389493', '417ecd77-ba1d-4f50-a182-fa525e933918'),
(202, 56, 'N845858484', '417ecd77-ba1d-4f50-a182-fa525e933918'),
(203, 40, 'G09786123', '76054198-110f-40c2-ab10-e66ab1ffff88'),
(204, 41, 'M09786765', '76054198-110f-40c2-ab10-e66ab1ffff88'),
(205, 42, 'M09786432', '76054198-110f-40c2-ab10-e66ab1ffff88'),
(206, 74, 'J09234201', '9698ff46-3c94-4ee5-9a07-a9384cc258fb'),
(207, 46, 'P23782921', '9698ff46-3c94-4ee5-9a07-a9384cc258fb'),
(208, 3, 'P177585', '268aa770-bb03-417b-a362-566bb35f9cff'),
(209, 2, 'S143457', '268aa770-bb03-417b-a362-566bb35f9cff'),
(210, 94, 'N84384384', 'c9c1c0c6-4278-4f81-bd59-d1bed295866d'),
(211, 93, 'N84383485', 'c9c1c0c6-4278-4f81-bd59-d1bed295866d'),
(212, 4, 'B09123858', '1382b1bc-c21d-4269-b18f-25524e8c860e'),
(213, 3, 'K02423920', '1382b1bc-c21d-4269-b18f-25524e8c860e'),
(214, 17, 'K2012310', '36d321d8-ceac-4a6d-9219-2b00dfa7f145'),
(215, 16, 'K0942023', '36d321d8-ceac-4a6d-9219-2b00dfa7f145'),
(216, 55, 'J09786543', '3fd1b576-764a-4189-b07f-a7ee8509eb1a'),
(217, 54, 'P09723521', '3fd1b576-764a-4189-b07f-a7ee8509eb1a'),
(218, 4, 'K587121', 'a159e57b-2463-46a9-a0bb-0368ff370206'),
(219, 3, 'SS77854', 'a159e57b-2463-46a9-a0bb-0368ff370206'),
(220, 10, 'T09123011', 'edbae785-2e92-4f2b-a1f3-f16841f3e049'),
(221, 2, 'I234239230', 'edbae785-2e92-4f2b-a1f3-f16841f3e049'),
(222, 1, 'P12308922', 'edbae785-2e92-4f2b-a1f3-f16841f3e049'),
(223, 24, 'N8499848', '5fec27f4-f221-4a05-ae9a-adb749118cea'),
(224, 23, 'N9439898', '5fec27f4-f221-4a05-ae9a-adb749118cea'),
(225, 22, 'N8758548', '5fec27f4-f221-4a05-ae9a-adb749118cea'),
(226, 59, 'M09786512', '3a78eed3-038b-403c-a651-bcdac97c33eb'),
(227, 60, 'L09786512', '3a78eed3-038b-403c-a651-bcdac97c33eb'),
(228, 55, 'D585769', 'dd3fb3fd-ef72-41fe-baf5-9c65b4aef169'),
(229, 54, 'L452145', 'dd3fb3fd-ef72-41fe-baf5-9c65b4aef169'),
(230, 3, 'N57549855', '0661c969-98a2-43a0-b1e3-e06b38604bb0'),
(231, 4, 'N87458743', '0661c969-98a2-43a0-b1e3-e06b38604bb0'),
(232, 41, 'E787741', '6cf5a9af-a0d5-43ea-9f6b-ccd4729267c6'),
(233, 40, 'C141215', '6cf5a9af-a0d5-43ea-9f6b-ccd4729267c6'),
(234, 61, 'N8348383', '0b72da3d-0aef-43a8-8595-fafae691f7c8'),
(235, 60, 'N8548848', '0b72da3d-0aef-43a8-8595-fafae691f7c8'),
(236, 68, 'G09786763', 'ce2b9c32-e95c-4beb-b8dd-70af23716876'),
(237, 67, 'M09786768', 'ce2b9c32-e95c-4beb-b8dd-70af23716876'),
(238, 10, 'K442001', 'f4cdc60f-50f2-40d3-a61f-845da7af8e11'),
(239, 4, 'N285412', 'f4cdc60f-50f2-40d3-a61f-845da7af8e11'),
(240, 65, 'M09326543', '76ddc289-3bea-4057-a53e-2882413e1541'),
(241, 64, 'Q09786512', '76ddc289-3bea-4057-a53e-2882413e1541'),
(242, 78, 'T202018', 'db776793-d407-4109-ac2d-1577ea9065ba'),
(243, 77, 'P4475520', 'db776793-d407-4109-ac2d-1577ea9065ba'),
(244, 11, 'N834932833', '3f853cf9-2162-438d-adae-3a1acd57ee0c'),
(245, 10, 'N783483488', '3f853cf9-2162-438d-adae-3a1acd57ee0c'),
(246, 53, 'M09786513', '1b70be07-9b0c-40b1-a3ab-0d358ed86b2a'),
(247, 54, 'G09713543', '1b70be07-9b0c-40b1-a3ab-0d358ed86b2a'),
(248, 55, 'N9843985', 'f36587ea-7dca-40a3-9c7c-c6ffafbaf78e'),
(249, 54, 'N8344838', 'f36587ea-7dca-40a3-9c7c-c6ffafbaf78e'),
(250, 53, 'N8735484', 'f36587ea-7dca-40a3-9c7c-c6ffafbaf78e'),
(251, 20, 'K461928', '4a60a9f7-3ae6-4408-bb55-3df1ca0a6cb4'),
(252, 22, 'G458562', '4a60a9f7-3ae6-4408-bb55-3df1ca0a6cb4'),
(253, 21, 'B100258', '4a60a9f7-3ae6-4408-bb55-3df1ca0a6cb4'),
(254, 23, 'N84378434', '064016f1-5b6c-42a2-94f2-e3b2f64138c0'),
(255, 22, 'N43884334', '064016f1-5b6c-42a2-94f2-e3b2f64138c0'),
(256, 51, 'N9493494', '87c44b07-944a-42ba-b192-746a66d77dc8'),
(257, 4, 'N8458384', '5f7d4f0b-e11d-44ec-8628-a2b0547af5ae'),
(258, 3, 'N8548598', '5f7d4f0b-e11d-44ec-8628-a2b0547af5ae'),
(259, 46, 'A25416136', 'aaddbf86-adb1-4da8-923f-d0a166bcb9de'),
(260, 45, 'D23512526', 'aaddbf86-adb1-4da8-923f-d0a166bcb9de'),
(261, 41, 'j1291230', 'b387d1a8-b1a4-4300-a247-6017aa17e9cf'),
(262, 1, 'J091231', 'fad8984f-1afc-4c72-8563-9b714e2fc281'),
(263, 23, 'K1239101', '1690b8e1-60d0-4bdc-96a3-15025226a113'),
(264, 2, 'J0132123', '9d2b11b6-cc73-4de4-ad82-824583c1c29b'),
(265, 3, 'H2349223', 'bb367ee2-8655-4f6e-aea6-1e59c6f0753e');

-- --------------------------------------------------------

--
-- Table structure for table `user_types`
--

CREATE TABLE `user_types` (
  `user_type` varchar(20) NOT NULL,
  `discount` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user_types`
--

INSERT INTO `user_types` (`user_type`, `discount`) VALUES
('frequent', 5),
('gold', 9),
('normal', 0);

-- --------------------------------------------------------

--
-- Structure for view `passenger_flight_details`
--
DROP TABLE IF EXISTS `passenger_flight_details`;

CREATE ALGORITHM=UNDEFINED  SQL SECURITY DEFINER VIEW `passenger_flight_details`  AS SELECT `booking`.`flight_id` AS `flight_id`, `flights`.`flight_no` AS `flight_no`, `ticket`.`passport_number` AS `passport_number`, `passenger`.`passenger_name` AS `passenger_name`, `passenger`.`dob` AS `dob` FROM ((`booking` join `flights` on((`booking`.`flight_id` = `flights`.`flight_id`))) join (`ticket` join `passenger` on((`ticket`.`passport_number` = `passenger`.`passport_number`))) on((`booking`.`booking_id` = `ticket`.`booking_id`))) ;

-- --------------------------------------------------------

--
-- Structure for view `seat_details`
--
DROP TABLE IF EXISTS `seat_details`;

CREATE ALGORITHM=UNDEFINED  SQL SECURITY DEFINER VIEW `seat_details`  AS SELECT `f`.`flight_id` AS `flight_id`, `f`.`airplane_id` AS `airplane_id`, `m`.`economy_seatcapacity` AS `economy_seatcapacity`, `m`.`business_seatcapacity` AS `business_seatcapacity`, `m`.`platinum_seatcapacity` AS `platinum_seatcapacity` FROM ((`flights` `f` left join `airplane` `a` on((`f`.`airplane_id` = `a`.`airplane_id`))) left join `aircraft_model` `m` on((`a`.`model_id` = `m`.`model_id`))) ;

-- --------------------------------------------------------

--
-- Structure for view `shedule`
--
DROP TABLE IF EXISTS `shedule`;

CREATE ALGORITHM=UNDEFINED  SQL SECURITY DEFINER VIEW `shedule`  AS SELECT `flights`.`route_id` AS `route_id`, `flights`.`flight_id` AS `flight_id`, `flights`.`airplane_id` AS `airplane_id`, `flight_status`.`status` AS `status`, `flights`.`departure_time` AS `departure_time`, `flights`.`arrival_time` AS `arrival_time`, `flights`.`flight_no` AS `flight_no`, `flights`.`economy_fare` AS `economy_fare`, `flights`.`business_fare` AS `business_fare`, `flights`.`platinum_fare` AS `platinum_fare`, `route`.`origin` AS `origin`, `route`.`destination` AS `destination`, `airport`.`image_url` AS `image_url` FROM (((`flights` left join `route` on((`flights`.`route_id` = `route`.`route_id`))) left join `airport` on((`route`.`destination` = `airport`.`airport_code`))) left join `flight_status` on((`flights`.`flightstatus_id` = `flight_status`.`flightstatus_id`))) ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`username`);

--
-- Indexes for table `aircraft_model`
--
ALTER TABLE `aircraft_model`
  ADD PRIMARY KEY (`model_id`),
  ADD UNIQUE KEY `model_name_UNIQUE` (`model_name`);

--
-- Indexes for table `airplane`
--
ALTER TABLE `airplane`
  ADD PRIMARY KEY (`airplane_id`),
  ADD KEY `model_id_idx` (`model_id`);

--
-- Indexes for table `airport`
--
ALTER TABLE `airport`
  ADD PRIMARY KEY (`airport_code`);

--
-- Indexes for table `booking`
--
ALTER TABLE `booking`
  ADD PRIMARY KEY (`booking_id`),
  ADD KEY `booked_by_idx` (`user_id`),
  ADD KEY `flight_id_idx` (`flight_id`);

--
-- Indexes for table `flights`
--
ALTER TABLE `flights`
  ADD PRIMARY KEY (`flight_id`),
  ADD UNIQUE KEY `route_id` (`route_id`,`departure_time`),
  ADD KEY `airplane_id_idx` (`airplane_id`),
  ADD KEY `flightstatus_id_idx` (`flightstatus_id`),
  ADD KEY `route_id_idx` (`route_id`),
  ADD KEY `departure_time` (`departure_time`),
  ADD KEY `arrival_time` (`arrival_time`);

--
-- Indexes for table `flight_status`
--
ALTER TABLE `flight_status`
  ADD PRIMARY KEY (`flightstatus_id`),
  ADD KEY `flight_status_ibfk_1` (`flightstatus_id`);

--
-- Indexes for table `passenger`
--
ALTER TABLE `passenger`
  ADD PRIMARY KEY (`passport_number`);

--
-- Indexes for table `registerd_users`
--
ALTER TABLE `registerd_users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `user_type` (`user_type`);

--
-- Indexes for table `route`
--
ALTER TABLE `route`
  ADD PRIMARY KEY (`route_id`),
  ADD UNIQUE KEY `route` (`origin`,`destination`),
  ADD KEY `fk_origin` (`origin`) ,
  ADD KEY `fk_destination` (`destination`);

--
-- Indexes for table `ticket`
--
ALTER TABLE `ticket`
  ADD PRIMARY KEY (`ticket_id`),
  ADD UNIQUE KEY `ticket` (`seat_no`,`booking_id`),
  ADD KEY `passport_number` (`passport_number`),
  ADD KEY `booking_id` (`booking_id`) ;

--
-- Indexes for table `user_types`
--
ALTER TABLE `user_types`
  ADD PRIMARY KEY (`user_type`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `flights`
--
ALTER TABLE `flights`
  MODIFY `flight_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=133;

--
-- AUTO_INCREMENT for table `registerd_users`
--
ALTER TABLE `registerd_users`
  MODIFY `user_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `ticket`
--
ALTER TABLE `ticket`
  MODIFY `ticket_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=266;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `airplane`
--
ALTER TABLE `airplane`
  ADD CONSTRAINT `model_id` FOREIGN KEY (`model_id`) REFERENCES `aircraft_model` (`model_id`);

--
-- Constraints for table `booking`
--
ALTER TABLE `booking`
  ADD CONSTRAINT `flight_id` FOREIGN KEY (`flight_id`) REFERENCES `flights` (`flight_id`),
  ADD CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `registerd_users` (`user_id`);

--
-- Constraints for table `flights`
--
ALTER TABLE `flights`
  ADD CONSTRAINT `airplane_id` FOREIGN KEY (`airplane_id`) REFERENCES `airplane` (`airplane_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `flightstatus_id` FOREIGN KEY (`flightstatus_id`) REFERENCES `flight_status` (`flightstatus_id`),
  ADD CONSTRAINT `route_id` FOREIGN KEY (`route_id`) REFERENCES `route` (`route_id`);

--
-- Constraints for table `registerd_users`
--
ALTER TABLE `registerd_users`
  ADD CONSTRAINT `registerd_users_ibfk_1` FOREIGN KEY (`user_type`) REFERENCES `user_types` (`user_type`);

--
-- Constraints for table `route`
--
ALTER TABLE `route`
  ADD CONSTRAINT `fk_destination` FOREIGN KEY (`destination`) REFERENCES `airport` (`airport_code`),
  ADD CONSTRAINT `fk_origin` FOREIGN KEY (`origin`) REFERENCES `airport` (`airport_code`);

--
-- Constraints for table `ticket`
--
ALTER TABLE `ticket`
  ADD CONSTRAINT `ticket_ibfk_1` FOREIGN KEY (`passport_number`) REFERENCES `passenger` (`passport_number`),
  ADD CONSTRAINT `ticket_ibfk_2` FOREIGN KEY (`booking_id`) REFERENCES `booking` (`booking_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;