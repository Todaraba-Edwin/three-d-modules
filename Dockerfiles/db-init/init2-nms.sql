USE prizm;

CREATE TABLE `TN_BUILDINGS` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(100) UNIQUE NOT NULL,
  `address` varchar(255),
  `latitude` decimal(10,8),
  `longitude` decimal(11,8)
);

CREATE TABLE `TN_FLOORS` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `building_id` bigint NOT NULL,
  `name` varchar(50) NOT NULL
);

CREATE TABLE `TN_SPACES` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `floor_id` bigint NOT NULL,
  `name` varchar(100) NOT NULL,
  `type` varchar(50)
);

CREATE TABLE `TN_ENCLOSURES` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `space_id` bigint COMMENT 'FK to spaces.id',
  `name` varchar(100) NOT NULL,
  `type` ENUM ('MDF', 'ODF', 'OFD', 'FDF', 'IDF'),
  `parent_enclosure_id` bigint,
  `location` json NOT NULL,
  `description` json
);

CREATE TABLE `TN_LINES` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `type` ENUM ('FIBER', 'ELECTRONIC') NOT NULL
);

CREATE TABLE `TN_FIBERS` (
  `line_id` bigint PRIMARY KEY,
  `from_enclosure_id` bigint NOT NULL,
  `to_enclosure_id` bigint NOT NULL,
  `fiber_type` ENUM ('SINGLE', 'MULTI', 'MIXED'),
  `core_count` int NOT NULL,
  `length_m` bigint,
  `description` json,
  `path` json
);

CREATE TABLE `TN_CORES` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `fiber_id` bigint NOT NULL,
  `core_number` int NOT NULL,
  `from_port_id` bigint,
  `to_port_id` bigint,
  `otdr_loss` decimal(10,5),
  `otdr_distance` bigint,
  `state` ENUM ('ACTIVE', 'INACTIVE', 'BROKEN') NOT NULL,
  `circuit_id` bigint,
  `circuit_sequence` int
);

CREATE TABLE `TN_RINGS` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255) UNIQUE NOT NULL,
  `description` json
);

CREATE TABLE `TN_CIRCUITS` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `ring_id` bigint,
  `name` varchar(255) UNIQUE NOT NULL,
  `start_port_id` bigint NOT NULL,
  `end_port_id` bigint NOT NULL,
  `total_otdr_distance` bigint,
  `description` json
);

CREATE TABLE `TC_MANUFACTURERS` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(100) UNIQUE NOT NULL,
  `description` varchar(100)
);

CREATE TABLE `TC_SWITCH_MODELS` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `manufacturer_id` bigint NOT NULL,
  `model_name` varchar(100) UNIQUE NOT NULL,
  `port_count` int NOT NULL,
  `community` varchar(255) NOT NULL,
  `name_oid` varchar(255) NOT NULL,
  `lldp_find_id_oid` varchar(255),
  `description` json
  );

CREATE TABLE `TN_SWITCHES` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `enclosure_id` bigint NOT NULL,
  `switch_model_id` bigint NOT NULL,
  `name` varchar(100) UNIQUE NOT NULL,
  `serial_number` varchar(255) UNIQUE NOT NULL,
  `form_factor` ENUM ('INTERNAL', 'EXTERNAL'),
  `description` json
);

CREATE TABLE `TN_DEVICES` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `device_type` varchar(100) NOT NULL,
  `name` varchar(100) UNIQUE NOT NULL,
  `description` json
);

CREATE TABLE `TN_PORTS` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `switch_id` bigint NOT NULL,
  `port_number` int NOT NULL,
  `port_type` ENUM ('OPTICAL', 'LAN') NOT NULL,
  `is_input` boolean,
  `connected_device_id` bigint,
  `neighbor_chassis_id` varchar(255),
  `neighbor_port_id` varchar(255),
  `neighbor_system_name` varchar(255),
  `last_updated` timestamp NOT NULL
);

CREATE TABLE `TN_SWITCH_MODEL_PORTS` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `switch_model_id` bigint NOT NULL,
  `port_number` int NOT NULL,
  `port_type` ENUM ('RJ45', 'SFP') NOT NULL
);

ALTER TABLE `TN_FIBERS` ADD FOREIGN KEY (`line_id`) REFERENCES `TN_LINES` (`id`);

ALTER TABLE `TN_FLOORS` ADD FOREIGN KEY (`building_id`) REFERENCES `TN_BUILDINGS` (`id`);

ALTER TABLE `TN_SPACES` ADD FOREIGN KEY (`floor_id`) REFERENCES `TN_FLOORS` (`id`);

ALTER TABLE `TN_ENCLOSURES` ADD FOREIGN KEY (`space_id`) REFERENCES `TN_SPACES` (`id`);

ALTER TABLE `TN_ENCLOSURES` ADD FOREIGN KEY (`parent_enclosure_id`) REFERENCES `TN_ENCLOSURES` (`id`);

ALTER TABLE `TN_FIBERS` ADD FOREIGN KEY (`from_enclosure_id`) REFERENCES `TN_ENCLOSURES` (`id`);

ALTER TABLE `TN_FIBERS` ADD FOREIGN KEY (`to_enclosure_id`) REFERENCES `TN_ENCLOSURES` (`id`);

ALTER TABLE `TN_CORES` ADD FOREIGN KEY (`fiber_id`) REFERENCES `TN_FIBERS` (`line_id`);

ALTER TABLE `TN_CORES` ADD FOREIGN KEY (`from_port_id`) REFERENCES `TN_PORTS` (`id`);

ALTER TABLE `TN_CORES` ADD FOREIGN KEY (`to_port_id`) REFERENCES `TN_PORTS` (`id`);

ALTER TABLE `TN_CORES` ADD FOREIGN KEY (`circuit_id`) REFERENCES `TN_CIRCUITS` (`id`);

ALTER TABLE `TN_CIRCUITS` ADD FOREIGN KEY (`ring_id`) REFERENCES `TN_RINGS` (`id`);

ALTER TABLE `TN_CIRCUITS` ADD FOREIGN KEY (`start_port_id`) REFERENCES `TN_PORTS` (`id`);

ALTER TABLE `TN_CIRCUITS` ADD FOREIGN KEY (`end_port_id`) REFERENCES `TN_PORTS` (`id`);

ALTER TABLE `TC_SWITCH_MODELS` ADD FOREIGN KEY (`manufacturer_id`) REFERENCES `TC_MANUFACTURERS` (`id`);

ALTER TABLE `TN_SWITCHES` ADD FOREIGN KEY (`enclosure_id`) REFERENCES `TN_ENCLOSURES` (`id`);

ALTER TABLE `TN_SWITCHES` ADD FOREIGN KEY (`switch_model_id`) REFERENCES `TC_SWITCH_MODELS` (`id`);

ALTER TABLE `TN_PORTS` ADD FOREIGN KEY (`switch_id`) REFERENCES `TN_SWITCHES` (`id`);

ALTER TABLE `TN_PORTS` ADD FOREIGN KEY (`connected_device_id`) REFERENCES `TN_DEVICES` (`id`);

ALTER TABLE `TN_SWITCH_MODEL_PORTS` ADD FOREIGN KEY (`switch_model_id`) REFERENCES `TC_SWITCH_MODELS` (`id`);

-- ####################################################################
-- # Initial Data for Manufacturers and Switch Models
-- ####################################################################

-- 1. HSTW
INSERT INTO `TC_MANUFACTURERS` (`name`, `description`) VALUES ('HSTW', '제조사_혜성');
SET @hst_id = LAST_INSERT_ID();
INSERT INTO `TC_SWITCH_MODELS` 
  (`manufacturer_id`, `model_name`, `port_count`, `community`, `name_oid`) 
VALUES 
  (@hst_id, 'IEL-6800M(8G4SF)', 12, 'public', '1.3.6.1.2.1.1.1.0');
SET @switch_model_id = LAST_INSERT_ID();
INSERT INTO `TN_SWITCH_MODEL_PORTS` (`switch_model_id`, `port_number`, `port_type`) VALUES
(@switch_model_id, 1000001, 'RJ45'),
(@switch_model_id, 1000002, 'RJ45'),
(@switch_model_id, 1000003, 'RJ45'),
(@switch_model_id, 1000004, 'RJ45'),
(@switch_model_id, 1000005, 'RJ45'),
(@switch_model_id, 1000006, 'RJ45'),
(@switch_model_id, 1000007, 'RJ45'),
(@switch_model_id, 1000008, 'RJ45'),
(@switch_model_id, 1000009, 'SFP'),
(@switch_model_id, 1000010, 'SFP'),
(@switch_model_id, 1000011, 'SFP'),
(@switch_model_id, 1000012, 'SFP');

-- 2. DASAN
INSERT INTO `TC_MANUFACTURERS` (`name`, `description`) VALUES ('DASAN', '제조사_두산');
SET @dasan_id = LAST_INSERT_ID();
INSERT INTO `TC_SWITCH_MODELS` 
  (`manufacturer_id`, `model_name`, `port_count`, `community`, `name_oid`, `lldp_find_id_oid`) 
VALUES 
  (@dasan_id, 'D3210G', 12, 'public', '1.3.6.1.4.1.6296.1.17.1.1.1.0', '1.3.6.1.4.1.6296.1.17.1.42.3.1');
SET @switch_model_id = LAST_INSERT_ID();
INSERT INTO `TN_SWITCH_MODEL_PORTS` (`switch_model_id`, `port_number`, `port_type`) VALUES
(@switch_model_id, 1, 'RJ45'),
(@switch_model_id, 2, 'RJ45'),
(@switch_model_id, 3, 'RJ45'),
(@switch_model_id, 4, 'RJ45'),
(@switch_model_id, 5, 'RJ45'),
(@switch_model_id, 6, 'RJ45'),
(@switch_model_id, 7, 'RJ45'),
(@switch_model_id, 8, 'RJ45'),
(@switch_model_id, 9, 'SFP'),
(@switch_model_id, 10, 'SFP'),
(@switch_model_id, 11, 'SFP'),
(@switch_model_id, 12, 'SFP');

-- 3. 에이엔비 정보기술
INSERT INTO `TC_MANUFACTURERS` (`name`,`description`) VALUES ('A&BTECk', '제조사_에이앤비 정보기술');
SET @aandb_id = LAST_INSERT_ID();
INSERT INTO `TC_SWITCH_MODELS` 
  (`manufacturer_id`, `model_name`, `port_count`, `community`, `name_oid`) 
VALUES 
  (@aandb_id, 'EMR-1000RT', 14, 'public', '1.3.6.1.2.1.1.1.0');
SET @switch_model_id = LAST_INSERT_ID();
INSERT INTO `TN_SWITCH_MODEL_PORTS` (`switch_model_id`, `port_number`, `port_type`) VALUES
(@switch_model_id, 1, 'RJ45'),
(@switch_model_id, 2, 'RJ45'),
(@switch_model_id, 3, 'RJ45'),
(@switch_model_id, 4, 'RJ45'),
(@switch_model_id, 5, 'RJ45'),
(@switch_model_id, 6, 'RJ45'),
(@switch_model_id, 7, 'RJ45'),
(@switch_model_id, 8, 'RJ45'),
(@switch_model_id, 9, 'SFP'),
(@switch_model_id, 10, 'SFP'),
(@switch_model_id, 11, 'SFP'),
(@switch_model_id, 12, 'SFP'),
(@switch_model_id, 13, 'SFP'),
(@switch_model_id, 14, 'SFP');