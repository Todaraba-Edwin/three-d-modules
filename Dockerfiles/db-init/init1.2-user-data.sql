USE prizm;

-- ####################################################################
-- # Initial Data for Users, Roles, Menus
-- ####################################################################

-- 1. Roles
INSERT INTO USER_TC_ROLES (role_code, role_name, role_description) VALUES
('ADMIN_MAIN', '최고 관리자', '모든 시스템에 대한 전체 접근 권한'),
('ADMIN_SUB', '중간 관리자', 'LMS/FMS 시스템 운영 및 모니터링 권한'),
('USER', '일반 사용자', '시스템 운영 및 모니터링 권한');

-- 2. Menus
INSERT INTO USER_TC_MENUS (label, path, icon_name, sort_order) VALUES
('대시보드', '/', 'HOME', 1),
('관리자', '/system-admin', 'SHIELD', 2),
('디지털 트윈(3D) 관제', '/3dms', 'BOX', 3),
('LMS 관리', '/lms', 'NETWORK', 4),
('FMS 관리', '/fms', 'CAMERA', 5),
('정보', '/system-info', 'INFO', 6),
('설정', '/settings', 'SETTINGS', 7);

-- 3. Role-Menu Permissions
-- Get Role IDs
SET @admin_main_role_id = (SELECT id from USER_TC_ROLES where role_code = 'ADMIN_MAIN');
SET @admin_sub_role_id = (SELECT id from USER_TC_ROLES where role_code = 'ADMIN_SUB');
SET @user_role_id = (SELECT id from USER_TC_ROLES where role_code = 'USER');

-- Get all menu IDs
SET @menu_dashboard_id = (SELECT id from USER_TC_MENUS where path = '/');
SET @menu_admin_id = (SELECT id from USER_TC_MENUS where path = '/system-admin');
SET @menu_3dms_id = (SELECT id from USER_TC_MENUS where path = '/3dms');
SET @menu_lms_id = (SELECT id from USER_TC_MENUS where path = '/lms');
SET @menu_fms_id = (SELECT id from USER_TC_MENUS where path = '/fms');
SET @menu_info_id = (SELECT id from USER_TC_MENUS where path = '/system-info');
SET @menu_settings_id = (SELECT id from USER_TC_MENUS where path = '/settings');

-- ADMIN_MAIN: can access all
INSERT INTO USER_TN_ROLE_MENU_PERMISSIONS (role_id, menu_id, can_access) VALUES
(@admin_main_role_id, @menu_dashboard_id, TRUE),
(@admin_main_role_id, @menu_admin_id, TRUE),
(@admin_main_role_id, @menu_3dms_id, TRUE),
(@admin_main_role_id, @menu_lms_id, TRUE),
(@admin_main_role_id, @menu_fms_id, TRUE),
(@admin_main_role_id, @menu_info_id, TRUE),
(@admin_main_role_id, @menu_settings_id, TRUE);

-- ADMIN_SUB: can access all except '/system-admin'
INSERT INTO USER_TN_ROLE_MENU_PERMISSIONS (role_id, menu_id, can_access) VALUES
(@admin_sub_role_id, @menu_dashboard_id, TRUE),
(@admin_sub_role_id, @menu_admin_id, FALSE),
(@admin_sub_role_id, @menu_3dms_id, TRUE),
(@admin_sub_role_id, @menu_lms_id, TRUE),
(@admin_sub_role_id, @menu_fms_id, TRUE),
(@admin_sub_role_id, @menu_info_id, TRUE),
(@admin_sub_role_id, @menu_settings_id, TRUE);

-- USER: can access all except '/system-admin' and '/settings'
INSERT INTO USER_TN_ROLE_MENU_PERMISSIONS (role_id, menu_id, can_access) VALUES
(@user_role_id, @menu_dashboard_id, TRUE),
(@user_role_id, @menu_admin_id, FALSE),
(@user_role_id, @menu_3dms_id, TRUE),
(@user_role_id, @menu_lms_id, TRUE),
(@user_role_id, @menu_fms_id, TRUE),
(@user_role_id, @menu_info_id, TRUE),
(@user_role_id, @menu_settings_id, FALSE);