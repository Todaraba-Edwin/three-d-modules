USE prizm;

-- ####################################################################
-- # Initial Data for Buildings
-- ####################################################################
INSERT INTO `BMS_TN_BUILDINGS` (`building_name`, `address`, `building_image`,`latitude`, `longitude`) VALUES 
('강원정보문화산업진흥원', '강원 춘천시 서면 박사로 882 강원창작개발센터', '/media/images/강원정보문화산업진흥원.png', '37.89504', '127.69271');

SET @init_building_id = (SELECT id from BMS_TN_BUILDINGS where building_name = '강원정보문화산업진흥원');
INSERT INTO `BMS_TN_FLOORS` (`building_id`, `floor_name`, `floor_type`,`floor_glb`,`latitude`, `longitude`, `height`, `heading`) VALUES 
(@init_building_id, '바닥층', 'SURFACE', '/media/glbs/G1.glb', 37.5667, 126.9784, 0, 0),
(@init_building_id, '지상1층', 'FLOOR', '/media/glbs/F_01.glb', 37.56535253323751, 126.98043995723785, 0, 0),
(@init_building_id, '지상2층', 'FLOOR', '/media/glbs/F_02.glb', 37.56535253323751, 126.98043995723785, 0, 0),
(@init_building_id, '지상3층', 'FLOOR', '/media/glbs/F_03.glb', 37.56535253323751, 126.98043995723785, 0, 0),
(@init_building_id, '지상4층', 'FLOOR', '/media/glbs/F_04.glb', 37.56535253323751, 126.98043995723785, 0, 0);


-- ####################################################################
-- # Initial Data for Manufacturers and Switch Models
-- ####################################################################

-- 1. HSTW
INSERT INTO `NMS_TC_MANUFACTURERS` (`name`, `description`) VALUES ('HSTW', '제조사_혜성');
SET @hst_id = LAST_INSERT_ID();
INSERT INTO `NMS_TC_SWITCH_MODELS` 
  (`manufacturer_id`, `model_name`, `port_count`, `community`, `name_oid`) 
VALUES 
  (@hst_id, 'IEL-6800M(8G4SF)', 12, 'public', '1.3.6.1.2.1.1.1.0');
SET @switch_model_id = LAST_INSERT_ID();
INSERT INTO `NMS_TN_SWITCH_MODEL_PORTS` (`switch_model_id`, `port_number`, `port_type`) VALUES
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
INSERT INTO `NMS_TC_MANUFACTURERS` (`name`, `description`) VALUES ('DASAN', '제조사_두산');
SET @dasan_id = LAST_INSERT_ID();
INSERT INTO `NMS_TC_SWITCH_MODELS` 
  (`manufacturer_id`, `model_name`, `port_count`, `community`, `name_oid`, `lldp_find_id_oid`) 
VALUES 
  (@dasan_id, 'D3210G', 12, 'public', '1.3.6.1.4.1.6296.1.17.1.1.1.0', '1.3.6.1.4.1.6296.1.17.1.42.3.1');
SET @switch_model_id = LAST_INSERT_ID();
INSERT INTO `NMS_TN_SWITCH_MODEL_PORTS` (`switch_model_id`, `port_number`, `port_type`) VALUES
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
INSERT INTO `NMS_TC_MANUFACTURERS` (`name`,`description`) VALUES ('A&BTECk', '제조사_에이앤비 정보기술');
SET @aandb_id = LAST_INSERT_ID();
INSERT INTO `NMS_TC_SWITCH_MODELS` 
  (`manufacturer_id`, `model_name`, `port_count`, `community`, `name_oid`) 
VALUES 
  (@aandb_id, 'EMR-1000RT', 14, 'public', '1.3.6.1.2.1.1.1.0');
SET @switch_model_id = LAST_INSERT_ID();
INSERT INTO `NMS_TN_SWITCH_MODEL_PORTS` (`switch_model_id`, `port_number`, `port_type`) VALUES
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