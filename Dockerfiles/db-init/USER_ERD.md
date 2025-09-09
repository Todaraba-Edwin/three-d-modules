# Prizm USER - ERD (Entity-Relationship Diagram)

[1. 시스템 개요](#1-시스템-개요)
[2. ERD 설계](#2-erd-설계)
- [2.1. 사용자 및 권한 그룹](#21-사용자-및-권한-그룹)
  - [`USER_TN_USERS` - 사용자 정보](#tn_users---사용자-정보)
  - [`TC_ROLES` - 역할 정보](#tc_roles---역할-정보)
  - [`TN_USER_ROLES` - 사용자-역할 매핑](#tn_user_roles---사용자-역할-매핑)
- [2.2. 메뉴 및 접근제어 그룹](#22-메뉴-및-접근제어-그룹)
  - [`TC_MENUS` - 메뉴 정보](#tc_menus---메뉴-정보)
  - [`TN_ROLE_MENU_PERMISSIONS` - 역할-메뉴 권한](#tn_role_menu_permissions---역할-메뉴-권한)
[3. 주요 개념 및 데이터 흐름](#3-주요-개념-및-데이터-흐름)
- [3.1. 사용자, 역할, 메뉴의 관계](#31-사용자-역할-메뉴의-관계)
[4. 접근제어 시나리오](#4-접근제어-시나리오)
- [4.1. 시나리오 1: 최고 관리자 (ADMIN_MAIN)](#41-시나리오-1-최고-관리자-admin_main)
- [4.2. 시나리오 2: 부 관리자 (ADMIN_SUB)](#42-시나리오-2-부-관리자-admin_sub)
- [4.3. 시나리오 3: 일반 사용자 (USER)](#43-시나리오-3-일반-사용자-user)

## 1. 시스템 개요
> - Prizm 사용자 관리 시스템은 역할 기반 접근 제어(RBAC) 모델을 따릅니다.
> - 사용자는 하나 이상의 역할을 가질 수 있으며, 각 역할은 특정 메뉴에 대한 접근 권한을 가집니다.
> - 이를 통해 유연하고 중앙화된 권한 관리가 가능합니다.

## 2. ERD 설계

> 용어설명
> - AI : Auto Increment : 값이 자동으로 증가하면서 고유 ID를 생성, 주로 PK 값에 부여
> - NN : Not Null : Null 값이 허용되지 않음
> - UQ : Unique : 해당 컬럼의 값이 중복될 수 없음
> - FK : Foreign Key : 다른 테이블의 PK를 참조하는 값

### 2.1. 사용자 및 권한 그룹

#### `USER_TN_USERS` - 사용자 정보

| 컬럼명 | 데이터 타입 | 제약조건 | 설명 |
| --- | --- | --- | --- |
| `id` | BIGINT | PK, AI | 사용자 고유 ID |
| `username` | VARCHAR(50) | NN, UQ | 로그인 ID |
| `nickname` | VARCHAR(50) | | 사용자 별명 |
| `password` | VARCHAR(255) | NN | 해시된 비밀번호 |
| `user_type` | ENUM | NN | 사용자 타입 (ADMIN_MAIN, ADMIN_SUB, USER) |
| `email` | VARCHAR(100) | NN, UQ | 이메일 주소 |
| `created_at` | DATETIME | | 생성일 |
| `updated_at` | DATETIME | | 수정일 |

#### `TC_ROLES` - 역할 정보

| 컬럼명 | 데이터 타입 | 제약조건 | 설명 |
| --- | --- | --- | --- |
| `id` | BIGINT | PK, AI | 역할 고유 ID |
| `role_code` | VARCHAR(50) | NN, UQ | 역할 코드 (예: ADMIN_MAIN) |
| `role_name` | VARCHAR(100) | NN | 역할 이름 (예: 최고 관리자) |

#### `TN_USER_ROLES` - 사용자-역할 매핑

| 컬럼명 | 데이터 타입 | 제약조건 | 설명 |
| --- | --- | --- | --- |
| `user_id` | BIGINT | PK, FK | 사용자 ID (`USER_TN_USERS.id`) |
| `role_id` | BIGINT | PK, FK | 역할 ID (`TC_ROLES.id`) |

### 2.2. 메뉴 및 접근제어 그룹

#### `TC_MENUS` - 메뉴 정보

| 컬럼명 | 데이터 타입 | 제약조건 | 설명 |
| --- | --- | --- | --- |
| `id` | BIGINT | PK, AI | 메뉴 고유 ID |
| `label` | VARCHAR(50) | NN | 메뉴 표시 이름 (예: 대시보드) |
| `path` | VARCHAR(100) | NN, UQ | 메뉴 경로 (예: /dashboard) |
| `icon_name` | VARCHAR(50) | | 아이콘 이름 (UI 표시용) |
| `parent_id` | BIGINT | FK | 상위 메뉴 ID (계층 구조용) |
| `sort_order` | INT | | 정렬 순서 |
| `is_active` | BOOLEAN | | 활성화 여부 |

#### `TN_ROLE_MENU_PERMISSIONS` - 역할-메뉴 권한

| 컬럼명 | 데이터 타입 | 제약조건 | 설명 |
| --- | --- | --- | --- |
| `role_id` | BIGINT | PK, FK | 역할 ID (`TC_ROLES.id`) |
| `menu_id` | BIGINT | PK, FK | 메뉴 ID (`TC_MENUS.id`) |
| `can_access` | BOOLEAN | | 접근 가능 여부 (TRUE/FALSE) |

## 3. 주요 개념 및 데이터 흐름

### 3.1. 사용자, 역할, 메뉴의 관계
- **사용자(User)와 역할(Role)은 N:M 관계**: 한 명의 사용자는 여러 역할을 가질 수 있고, 하나의 역할은 여러 사용자에게 부여될 수 있습니다. 이 관계는 `TN_USER_ROLES` 매핑 테이블을 통해 구현됩니다.
- **역할(Role)과 메뉴(Menu)는 N:M 관계**: 하나의 역할은 여러 메뉴에 대한 접근 권한을 가질 수 있고, 하나의 메뉴는 여러 역할에 의해 접근될 수 있습니다. 이 관계는 `TN_ROLE_MENU_PERMISSIONS` 매핑 테이블을 통해 구현됩니다.
- **데이터 흐름**:
  1. 사용자가 로그인을 시도합니다 (`USER_TN_USERS`).
  2. 인증 성공 시, 해당 사용자의 `user_id`를 통해 `TN_USER_ROLES`에서 역할(들)의 `role_id`를 조회합니다.
  3. 조회된 `role_id`(들)을 사용하여 `TN_ROLE_MENU_PERMISSIONS`에서 `can_access`가 TRUE인 모든 `menu_id`를 조회합니다.
  4. 해당 `menu_id`에 해당하는 메뉴 정보(`TC_MENUS`)를 사용자에게 노출합니다.

## 4. 접근제어 시나리오

### 4.1. 시나리오 1: 최고 관리자 (ADMIN_MAIN)
- **설명**: `ADMIN_MAIN` 역할을 가진 사용자는 시스템의 모든 기능에 접근할 수 있어야 합니다.
- **구현**: `TN_ROLE_MENU_PERMISSIONS` 테이블에서 `ADMIN_MAIN` 역할의 `role_id`와 모든 `menu_id`의 조합에 대해 `can_access` 값을 `TRUE`로 설정합니다.
- **결과**: `ADMIN_MAIN` 사용자는 '대시보드', '관리자', 'LMS 관리', 'FMS 관리', '정보', '설정' 메뉴에 모두 접근할 수 있습니다.

### 4.2. 시나리오 2: 부 관리자 (ADMIN_SUB)
- **설명**: `ADMIN_SUB` 역할을 가진 사용자는 '관리자' 메뉴를 제외한 모든 기능에 접근할 수 있습니다.
- **구현**: `TN_ROLE_MENU_PERMISSIONS` 테이블에서 `ADMIN_SUB` 역할의 `role_id`에 대해, '관리자' 메뉴(`path: /system-admin`)에 해당하는 `menu_id`의 `can_access`를 `FALSE`로 설정하고, 나머지 메뉴에 대해서는 `TRUE`로 설정합니다.
- **결과**: `ADMIN_SUB` 사용자는 '관리자' 메뉴를 보거나 접근할 수 없습니다.

### 4.3. 시나리오 3: 일반 사용자 (USER)
- **설명**: `USER` 역할을 가진 사용자는 '관리자'와 '설정' 메뉴를 제외한 기본 기능에만 접근할 수 있습니다.
- **구현**: `TN_ROLE_MENU_PERMISSIONS` 테이블에서 `USER` 역할의 `role_id`에 대해, '관리자'(`path: /system-admin`)와 '설정'(`path: /settings`) 메뉴에 해당하는 `menu_id`의 `can_access`를 `FALSE`로 설정하고, 나머지 메뉴에 대해서는 `TRUE`로 설정합니다.
- **결과**: `USER` 사용자는 '관리자'와 '설정' 메뉴를 보거나 접근할 수 없습니다.
