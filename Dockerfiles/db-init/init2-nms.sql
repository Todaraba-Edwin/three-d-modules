USE prizm;

CREATE TABLE `buildings` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(100) UNIQUE NOT NULL,
  `address` varchar(255),
  `latitude` decimal(10,8),
  `longitude` decimal(11,8)
);

CREATE TABLE `floors` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `building_id` bigint NOT NULL,
  `name` varchar(50) NOT NULL
);

CREATE TABLE `spaces` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `floor_id` bigint NOT NULL,
  `name` varchar(100) NOT NULL,
  `type` varchar(50)
);

CREATE TABLE `enclosures` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `space_id` bigint COMMENT 'FK to spaces.id',
  `name` varchar(100) NOT NULL,
  `type` ENUM ('MDF', 'ODF', 'OFD', 'FDF', 'IDF'),
  `parent_enclosure_id` bigint,
  `location` json NOT NULL,
  `description` json
);

CREATE TABLE `lines` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `type` ENUM ('FIBER', 'ELECTRONIC') NOT NULL
);

CREATE TABLE `fibers` (
  `line_id` bigint PRIMARY KEY,
  `from_enclosure_id` bigint NOT NULL,
  `to_enclosure_id` bigint NOT NULL,
  `fiber_type` ENUM ('SINGLE', 'MULTI', 'MIXED'),
  `core_count` int NOT NULL,
  `length_m` bigint,
  `description` json,
  `path` json
);

CREATE TABLE `cores` (
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

CREATE TABLE `rings` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255) UNIQUE NOT NULL,
  `description` json
);

CREATE TABLE `circuits` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `ring_id` bigint,
  `name` varchar(255) UNIQUE NOT NULL,
  `start_port_id` bigint NOT NULL,
  `end_port_id` bigint NOT NULL,
  `total_otdr_distance` bigint,
  `description` json
);

CREATE TABLE `manufacturers` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(100) UNIQUE NOT NULL,
  `description` json
);

CREATE TABLE `switch_models` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `manufacturer_id` bigint NOT NULL,
  `model_name` varchar(100) UNIQUE NOT NULL,
  `port_info` json,
  `description` json
);

CREATE TABLE `switches` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `enclosure_id` bigint NOT NULL,
  `switch_model_id` bigint NOT NULL,
  `name` varchar(100) UNIQUE NOT NULL,
  `serial_number` varchar(255) UNIQUE NOT NULL,
  `form_factor` ENUM ('INTERNAL', 'EXTERNAL'),
  `description` json
);

CREATE TABLE `devices` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `device_type` varchar(100) NOT NULL,
  `name` varchar(100) UNIQUE NOT NULL,
  `description` json
);

CREATE TABLE `ports` (
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

ALTER TABLE `fibers` ADD FOREIGN KEY (`line_id`) REFERENCES `lines` (`id`);

ALTER TABLE `floors` ADD FOREIGN KEY (`building_id`) REFERENCES `buildings` (`id`);

ALTER TABLE `spaces` ADD FOREIGN KEY (`floor_id`) REFERENCES `floors` (`id`);

ALTER TABLE `enclosures` ADD FOREIGN KEY (`space_id`) REFERENCES `spaces` (`id`);

ALTER TABLE `enclosures` ADD FOREIGN KEY (`parent_enclosure_id`) REFERENCES `enclosures` (`id`);

ALTER TABLE `fibers` ADD FOREIGN KEY (`from_enclosure_id`) REFERENCES `enclosures` (`id`);

ALTER TABLE `fibers` ADD FOREIGN KEY (`to_enclosure_id`) REFERENCES `enclosures` (`id`);

ALTER TABLE `cores` ADD FOREIGN KEY (`fiber_id`) REFERENCES `fibers` (`line_id`);

ALTER TABLE `cores` ADD FOREIGN KEY (`from_port_id`) REFERENCES `ports` (`id`);

ALTER TABLE `cores` ADD FOREIGN KEY (`to_port_id`) REFERENCES `ports` (`id`);

ALTER TABLE `cores` ADD FOREIGN KEY (`circuit_id`) REFERENCES `circuits` (`id`);

ALTER TABLE `circuits` ADD FOREIGN KEY (`ring_id`) REFERENCES `rings` (`id`);

ALTER TABLE `circuits` ADD FOREIGN KEY (`start_port_id`) REFERENCES `ports` (`id`);

ALTER TABLE `circuits` ADD FOREIGN KEY (`end_port_id`) REFERENCES `ports` (`id`);

ALTER TABLE `switch_models` ADD FOREIGN KEY (`manufacturer_id`) REFERENCES `manufacturers` (`id`);

ALTER TABLE `switches` ADD FOREIGN KEY (`enclosure_id`) REFERENCES `enclosures` (`id`);

ALTER TABLE `switches` ADD FOREIGN KEY (`switch_model_id`) REFERENCES `switch_models` (`id`);

ALTER TABLE `ports` ADD FOREIGN KEY (`switch_id`) REFERENCES `switches` (`id`);

ALTER TABLE `ports` ADD FOREIGN KEY (`connected_device_id`) REFERENCES `devices` (`id`);
