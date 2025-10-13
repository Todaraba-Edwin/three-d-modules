USE prizm;

-- BUILDING MANAGEMENT SYSTEM -----------------------------------------------------------
CREATE TABLE `BMS_TN_BUILDINGS` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `building_name` varchar(100) UNIQUE NOT NULL,
  `building_desc` varchar(255) DEFAULT '',
  `ground_floors` INT NOT NULL DEFAULT 0,
  `basement_floors` INT NOT NULL DEFAULT 0,
  `address` varchar(255),
  `building_image_url` varchar(255),
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

-- INFRASTRUCTURE MANAGEMENT SYSTEM -----------------------------------------------------
CREATE TABLE `IMS_TN_LINE_TYPES` (
  `type` ENUM('FIBER','ELECTRONIC') PRIMARY KEY,
  `color_code` VARCHAR(20) NOT NULL COMMENT '시각화용 색상',
  `description` VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `IMS_TN_LINES` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `type` ENUM('FIBER','ELECTRONIC') NOT NULL,
  FOREIGN KEY (`type`) REFERENCES `IMS_TN_LINE_TYPES`(`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- NETWORK MANAGEMENT SYSTEM -----------------------------------------------------------
CREATE TABLE `NMS_TN_ENCLOSURES` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `space_id` bigint COMMENT 'FK to spaces.id',
  `name` varchar(100) NOT NULL,
  `type` ENUM ('MDF', 'ODF', 'OFD', 'FDF', 'IDF', 'MDB', 'FDB', "PDB"),
  `sub_type` ENUM ('FRAME', 'BOARD'),  -- **F는 FRAME으로 통신함체를, **B는 BOARD로 전기함체를 
  `parent_enclosure_id` bigint,
  `location` json NOT NULL,
  `description` json,
  FOREIGN KEY (`space_id`) REFERENCES `BMS_TN_SPACES` (`id`),
  FOREIGN KEY (`parent_enclosure_id`) REFERENCES `NMS_TN_ENCLOSURES` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `NMS_TN_FIBERS` (
  `line_id` bigint PRIMARY KEY,
  `from_enclosure_id` bigint NOT NULL,
  `to_enclosure_id` bigint NOT NULL,
  `path` JSON COMMENT '배선 경로 좌표 [{lat, long, height}]',
  FOREIGN KEY (`line_id`) REFERENCES `IMS_TN_LINES` (`id`),
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

CREATE TABLE `NMS_TN_SWITCH_MODEL_PORTS` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `switch_model_id` bigint NOT NULL,
  `port_number` int NOT NULL,
  `port_type` ENUM ('RJ45', 'SFP') NOT NULL,
  FOREIGN KEY (`switch_model_id`) REFERENCES `NMS_TC_SWITCH_MODELS` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- FACILITY MANAGEMENT SYSTEM ----------------------------------------------------------
CREATE TABLE `FMS_TN_ELECTRONIC` (
  `line_id` bigint PRIMARY KEY,
  `from_enclosure_id` bigint NOT NULL,
  `to_enclosure_id` bigint NOT NULL,
  `core_count` INT COMMENT '케이블 심선 수 (예: 1, 2, 3, 4)',
  `cable_type` ENUM('CV','VCT') COMMENT '케이블 종류',
  `path` JSON COMMENT '배선 경로 좌표 [{lat, long, height}]',
  FOREIGN KEY (`line_id`) REFERENCES `IMS_TN_LINES` (`id`),
  FOREIGN KEY (`from_enclosure_id`) REFERENCES `NMS_TN_ENCLOSURES` (`id`),
  FOREIGN KEY (`to_enclosure_id`) REFERENCES `NMS_TN_ENCLOSURES` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;