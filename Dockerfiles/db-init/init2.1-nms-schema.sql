USE prizm;

CREATE TABLE `BMS_TN_BUILDINGS` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `building_name` varchar(100) UNIQUE NOT NULL,
  `building_desc` varchar(255) DEFAULT '',
  `ground_floors` INT NOT NULL DEFAULT 0,
  `basement_floors` INT NOT NULL DEFAULT 0,
  `address` varchar(255),
  `building_image` varchar(255),
  `latitude` DOUBLE NOT NULL,
  `longitude` DOUBLE NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `BMS_TN_FLOORS` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `floor_type` ENUM ('SURFACE', 'GROUND', 'BASEMENT') NOT NULL COMMENT '지상/지하/지표면 구분',
  `floor_number` INT NOT NULL COMMENT '층 번호 (지상은 1,2,3..., 지하는 -1,-2)',
  `building_id` bigint NOT NULL, -- 초기값으로 건물의 ID 계승
  `floor_name` varchar(50) NOT NULL DEFAULT '',
  `floor_desc` varchar(255) DEFAULT '',
  `floor_glb` varchar(255) NOT NULL DEFAULT '',
  `latitude` DOUBLE NOT NULL, -- 초기값으로 건물의 lat 계승
  `longitude` DOUBLE NOT NULL, -- 초기값으로 건물의 lon 계승
  `height` int  NOT NULL DEFAULT 0,
  `heading` int NOT NULL DEFAULT 0,
  FOREIGN KEY (`building_id`) REFERENCES `BMS_TN_BUILDINGS` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `BMS_TN_SPACES` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `space_name` varchar(100) NOT NULL,
  `floor_id` bigint NOT NULL,
  `type`  ENUM ('OFFICE', 'ELECTRICAL', 'SERVER', 'RESTROOM'),
  `latitude` DOUBLE NOT NULL,
  `longitude` DOUBLE NOT NULL,
  `height` int DEFAULT 0,
  `heading` int DEFAULT 0,
  `glb_name` varchar(100),
  FOREIGN KEY (`floor_id`) REFERENCES `BMS_TN_FLOORS` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `NMS_TN_ENCLOSURES` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `space_id` bigint COMMENT 'FK to spaces.id',
  `name` varchar(100) NOT NULL,
  `type` ENUM ('MDF', 'ODF', 'OFD', 'FDF', 'IDF'),
  `parent_enclosure_id` bigint,
  `location` json NOT NULL,
  `description` json,
  FOREIGN KEY (`space_id`) REFERENCES `BMS_TN_SPACES` (`id`),
  FOREIGN KEY (`parent_enclosure_id`) REFERENCES `NMS_TN_ENCLOSURES` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `NMS_TN_LINES` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `type` ENUM ('FIBER', 'ELECTRONIC') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `NMS_TN_FIBERS` (
  `line_id` bigint PRIMARY KEY,
  `from_enclosure_id` bigint NOT NULL,
  `to_enclosure_id` bigint NOT NULL,
  `fiber_type` ENUM ('SINGLE', 'MULTI', 'MIXED'),
  `core_count` int NOT NULL,
  `length_m` bigint,
  `description` json,
  `path` json,
  FOREIGN KEY (`line_id`) REFERENCES `NMS_TN_LINES` (`id`),
  FOREIGN KEY (`from_enclosure_id`) REFERENCES `NMS_TN_ENCLOSURES` (`id`),
  FOREIGN KEY (`to_enclosure_id`) REFERENCES `NMS_TN_ENCLOSURES` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `NMS_TC_MANUFACTURERS` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(100) UNIQUE NOT NULL,
  `description` varchar(100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `NMS_TC_SWITCH_MODELS` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `manufacturer_id` bigint NOT NULL,
  `model_name` varchar(100) UNIQUE NOT NULL,
  `port_count` int NOT NULL,
  `community` varchar(255) NOT NULL,
  `name_oid` varchar(255) NOT NULL,
  `lldp_find_id_oid` varchar(255),
  `description` json,
  FOREIGN KEY (`manufacturer_id`) REFERENCES `NMS_TC_MANUFACTURERS` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `NMS_TN_SWITCHES` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `enclosure_id` bigint NOT NULL,
  `switch_model_id` bigint NOT NULL,
  `name` varchar(100) UNIQUE NOT NULL,
  `serial_number` varchar(255) UNIQUE NOT NULL,
  `form_factor` ENUM ('INTERNAL', 'EXTERNAL'),
  `description` json,
  FOREIGN KEY (`enclosure_id`) REFERENCES `NMS_TN_ENCLOSURES` (`id`),
  FOREIGN KEY (`switch_model_id`) REFERENCES `NMS_TC_SWITCH_MODELS` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `NMS_TN_DEVICES` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `device_type` varchar(100) NOT NULL,
  `name` varchar(100) UNIQUE NOT NULL,
  `description` json
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `NMS_TN_PORTS` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `switch_id` bigint NOT NULL,
  `port_number` int NOT NULL,
  `port_type` ENUM ('OPTICAL', 'LAN') NOT NULL,
  `is_input` boolean,
  `connected_device_id` bigint,
  `neighbor_chassis_id` varchar(255),
  `neighbor_port_id` varchar(255),
  `neighbor_system_name` varchar(255),
  `last_updated` timestamp NOT NULL,
  FOREIGN KEY (`switch_id`) REFERENCES `NMS_TN_SWITCHES` (`id`),
  FOREIGN KEY (`connected_device_id`) REFERENCES `NMS_TN_DEVICES` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `NMS_TN_RINGS` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255) UNIQUE NOT NULL,
  `description` json
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `NMS_TN_CIRCUITS` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `ring_id` bigint,
  `name` varchar(255) UNIQUE NOT NULL,
  `start_port_id` bigint NOT NULL,
  `end_port_id` bigint NOT NULL,
  `total_otdr_distance` bigint,
  `description` json,
  FOREIGN KEY (`ring_id`) REFERENCES `NMS_TN_RINGS` (`id`),
  FOREIGN KEY (`start_port_id`) REFERENCES `NMS_TN_PORTS` (`id`),
  FOREIGN KEY (`end_port_id`) REFERENCES `NMS_TN_PORTS` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `NMS_TN_CORES` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `fiber_id` bigint NOT NULL,
  `core_number` int NOT NULL,
  `from_port_id` bigint,
  `to_port_id` bigint,
  `otdr_loss` decimal(10,5),
  `otdr_distance` bigint,
  `state` ENUM ('ACTIVE', 'INACTIVE', 'BROKEN') NOT NULL,
  `circuit_id` bigint,
  `circuit_sequence` int,
  FOREIGN KEY (`fiber_id`) REFERENCES `NMS_TN_FIBERS` (`line_id`),
  FOREIGN KEY (`from_port_id`) REFERENCES `NMS_TN_PORTS` (`id`),
  FOREIGN KEY (`to_port_id`) REFERENCES `NMS_TN_PORTS` (`id`),
  FOREIGN KEY (`circuit_id`) REFERENCES `NMS_TN_CIRCUITS` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `NMS_TN_SWITCH_MODEL_PORTS` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `switch_model_id` bigint NOT NULL,
  `port_number` int NOT NULL,
  `port_type` ENUM ('RJ45', 'SFP') NOT NULL,
  FOREIGN KEY (`switch_model_id`) REFERENCES `NMS_TC_SWITCH_MODELS` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;