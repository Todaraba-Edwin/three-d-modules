# Prizm LMS - ERD (Entity-Relationship Diagram) - v3.1 (Formatting Fix)

[1. 시스템 개요](#1-시스템-개요)
<br/>

[2. ERD 설계 (v1.0)](#2-erd-설계-v10)
- [2.1. 위치 정보 그룹](#21-위치-정보-그룹)
  - [`buildings` - 건물 정보](#buildings---건물-정보)
  - [`floors` - 층 정보](#floors---층-정보)
  - [`spaces` - 상세 공간 정보](#spaces---상세-공간-정보)
- [2.2. 장비 그룹](#22-장비-그룹)
  - [`enclosures` - 함체 정보](#enclosures---함체-정보)
  - [`lines` - 선로 정보](#lines---선로-정보)
  - [`fibers` - 광케이블 정보](#fibers---광케이블-정보)
  - [`cores` - 광케이블 코어 정보 (수정)](#cores---광케이블-코어-정보-수정)
  - [`rings` - 링 그룹 정보 (신규 추가)](#rings---링-그룹-정보-신규-추가)
  - [`circuits` - 논리 회선 정보 (수정)](#circuits---논리-회선-정보-수정)
  - [`manufacturers` - 제조사 정보](#manufacturers---제조사-정보)
  - [`switch_models` - 스위치 모델 정보](#switch_models---스위치-모델-정보)
  - [`switches` - 스위치 정보](#switches---스위치-정보)
  - [`devices` - 장치 정보](#devices---장치-정보)
  - [`ports` - 포트 정보](#ports---포트-정보)
<br/>

[3. 등록 시나리오](#3-등록-시나리오)
- [첫번째 시나리오, 코어링 구성](#첫번째-시나리오-코어링-구성)
- [두번째 시나리오, MDF와 복수의 ODF를 거친 상태에서의 ODTR과 LLDP 정보 조회](#두번째-시나리오-mdf와-복수의-odf를-거친-상태에서의-odtr과-lldp-정보-조회)
- [세번째 시나리오, ODF와 Fiber의 관계](#세번째-시나리오-odf와-fiber의-관계)
- [네번째 시나리오, MDF에서 core별 토폴로지 정의](#네번째-시나리오-mdf에서-core별-토폴로지-정의)

## 1. 시스템 개요
> - Prizm LMS(Line Management System)는 물리적인 광케이블 인프라를 역할과 논리적 경로 중심으로 관리하는 시스템 
> - CORE/ACCESS로 구분된 스위치의 역할을 정의하고, 내/외장 OTDR 정보를 구체화
> - 여러 개의 선로(Line)를 묶어 논리적인 경로(Path)를 정의하고,
> - 광케이블(Line-Fiber) 내의 광섬유 한 가닥(Core)별로 각 구간의 순서와 방향성(E/W)을 관리(구간별 감시 및 토폴로지 관리 고도화)

## 2. ERD 설계 (v1.0)
### 2.1. 위치 정보 그룹

> 용어설명
> - AI : Auto Increment : 값이 자동으로 증가하면서 고유 ID를 생성, 주로 PK 값에 부여
> - NN : Not Null : Null 값이 허용되지 않음
> - UQ : Unique : 해당 컬럼의 값이 중복될 수 없음 

#### `buildings` - 건물 정보

| 컬럼명 | 데이터 타입 | 제약조건 | 설명 |
| --- | --- | --- | --- |
| `id` | BIGINT | PK, AI | 건물 고유 ID |
| `name` | VARCHAR(100) | NN, UQ | 건물명 (예: 본관, 연구동) |
| `address` | VARCHAR(255) | | 주소 |
| `latitude` | DECIMAL(10, 8) | | 위도 (지도 연동용) |
| `longitude` | DECIMAL(11, 8) | | 경도 (지도 연동용) |

#### `floors` - 층 정보

| 컬럼명 | 데이터 타입 | 제약조건 | 설명 |
| --- | --- | --- | --- |
| `id` | BIGINT | PK, AI | 층 고유 ID |
| `building_id` | BIGINT | NN, FK | 소속 건물 ID (`buildings.id`) |
| `name` | VARCHAR(50) | NN | 층 이름 (예: 1F, B1) |

#### `spaces` - 상세 공간 정보

| 컬럼명 | 데이터 타입 | 제약조건 | 설명 |
| --- | --- | --- | --- |
| `id` | BIGINT | PK, AI | 공간 고유 ID |
| `floor_id` | BIGINT | NN, FK | 소속 층 ID (`floors.id`) |
| `name` | VARCHAR(100) | NN | 공간명 (예: MDF-A, 통신실-B) |
| `type` | VARCHAR(50) | | 공간 타입 (예: MDF, ODF, SERVER_ROOM) |

### 2.2. 장비 그룹

#### `enclosures` - 함체 정보

| 컬럼명 | 데이터 타입 | 제약조건 | 설명 |
| --- | --- | --- | --- |
| `id` | BIGINT | PK, AI | 함체 고유 ID |
| `name` | VARCHAR(100) | NN | 함체명 (예: 메인배전함, 중간배전함) |
| `type` | ENUM('MDF', 'ODF', 'OFD', 'FDF', 'IDF') | | 배전함 종류 |
| `parent_enclosure_id` | BIGINT | FK | 상위 배전함_id |
| `location` | JSON | NN | JSON({lat, log, height}) |
| `description` | JSON | | 설명 (예: JSON({content, images})) |

#### `lines` - 선로 정보

| 컬럼명 | 데이터 타입 | 제약조건 | 설명 |
| --- | --- | --- | --- |
| `id` | BIGINT | PK, AI | 선로 고유 ID |
| `type` | ENUM('FIBER', 'ELECTRONIC') | NN | 선로 타입 |
| `line_info_id` | BIGINT | NN, FK | 해당 선로 상세ID (e.g., `fibers.id`) |

> **`fibers`와 `cores`의 관계**
> - `fibers` 테이블은 **물리적인 광케이블**이 어떤 **함체(Enclosure)**와 어떤 **함체** 사이에 설치되었는지를 정의합니다. (거시적, 물리적 경로)
> - `cores` 테이블은 그 케이블 내 **개별 광섬유 가닥**이 A 함체의 **스위치 포트(Port)**와 B 함체의 **스위치 포트**를 어떻게 연결하는지를 정의합니다. (미시적, 논리적 신호 경로)

#### `fibers` - 광케이블 정보

| 컬럼명 | 데이터 타입 | 제약조건 | 설명 |
| --- | --- | --- | --- |
| `id` | BIGINT | PK, AI | 광케이블 고유 ID |
| `from_enclosure_id` | BIGINT | NN, FK | 연결된 시작 함체 (`enclosures.id`) |
| `to_enclosure_id` | BIGINT | NN, FK | 연결된 종료 함체 (`enclosures.id`) |
| `fiber_type` | ENUM('SINGLE', 'MULTI', 'MIXED') | | 광케이블의 연결방식 |
| `core_count` | INT | NN | 코어 수 |
| `length_m` | BIGINT | | 선로의 길이 |
| `description` | JSON | | 설명 (예: JSON({content, images})) |
| `path` | JSON | | 선로의 위치[{lat, lon, height}] |

#### `cores` - 광케이블 코어 정보 (수정)

| 컬럼명 | 데이터 타입 | 제약조건 | 설명 |
| --- | --- | --- | --- |
| `id` | BIGINT | PK, AI | 광섬유 고유 ID |
| `fiber_id` | BIGINT | NN, FK | 해당 광섬유가 등록된 광케이블 (`fibers.id`) |
| `core_number` | INT | NN | 광섬유에 할당된 광섬유 번호 |
| `from_port_id` | BIGINT | FK | 연결된 시작 포트 ID (`ports.id`) |
| `to_port_id` | BIGINT | FK | 연결된 종료 포트 ID (`ports.id`) |
| `otdr_loss` | DECIMAL(10, 5) | | **해당 구간**의 광손실률 |
| `otdr_distance` | BIGINT | | **해당 구간**의 거리 |
| `state` | ENUM('ACTIVE', 'INACTIVE', 'BROKEN') | NN | 해당 광섬유의 상태 |
| `circuit_id` | BIGINT | FK | **소속된 논리 회선 ID (`circuits.id`)** |
| `circuit_sequence` | INT | | **회선 내 순서 (e.g., 1, 2, 3...)** |

#### `rings` - 링 그룹 정보 (신규 추가)

> `rings` 테이블은 여러 `circuits`를 묶어 하나의 논리적인 링 또는 그룹으로 관리하기 위해 사용됩니다. 예를 들어, 이중화 경로를 가진 링, 또는 특정 목적을 위해 함께 관리되어야 하는 여러 회선을 하나의 이름으로 묶을 수 있습니다.

| 컬럼명 | 데이터 타입 | 제약조건 | 설명 |
| --- | --- | --- | --- |
| `id` | BIGINT | PK, AI | 링 고유 ID |
| `name` | VARCHAR(255) | NN, UQ | 링 이름 (예: "본관 CCTV 이중화 링") |
| `description` | JSON | | 링에 대한 상세 설명 |

#### `circuits` - 논리 회선 정보 (수정)

| 컬럼명 | 데이터 타입 | 제약조건 | 설명 |
| --- | --- | --- | --- |
| `id` | BIGINT | PK, AI | 논리 회선 고유 ID |
| `ring_id` | BIGINT | FK | 소속된 링 ID (`rings.id`) (Optional) |
| `name` | VARCHAR(255) | NN, UQ | 회선명 (예: "MDF-CCTV-123") |
| `start_port_id` | BIGINT | NN, FK | **회선 전체의 시작 포트 ID (`ports.id`)** |
| `end_port_id` | BIGINT | NN, FK | **회선 전체의 종단 포트 ID (`ports.id`)** |
| `total_otdr_distance` | BIGINT | | **회선 전체의 OTDR 측정 거리** |
| `description` | JSON | | 설명 |

#### `manufacturers` - 제조사 정보

| 컬럼명 | 데이터 타입 | 제약조건 | 설명 |
| --- | --- | --- | --- |
| `id` | BIGINT | PK, AI | 제조사 고유 ID |
| `name` | VARCHAR(100) | NN, UQ | 제조사명 |
| `description` | JSON | | 설명 |

#### `switch_models` - 스위치 모델 정보

| 컬럼명 | 데이터 타입 | 제약조건 | 설명 |
| --- | --- | --- | --- |
| `id` | BIGINT | PK, AI | 스위치 모델 고유 ID |
| `manufacturer_id` | BIGINT | NN, FK | 제조사 ID (`manufacturers.id`) |
| `model_name` | VARCHAR(100) | NN, UQ | 모델명 |
| `port_info` | JSON | | 포트 정보 (e.g., `[{port_number: 1, port_type: 'OPTICAL'}, ...]`) |
| `description` | JSON | | 설명 |

#### `switches` - 스위치 정보

| 컬럼명 | 데이터 타입 | 제약조건 | 설명 |
| --- | --- | --- | --- |
| `id` | BIGINT | PK, AI | 스위치 고유 ID |
| `enclosure_id` | BIGINT | NN, FK | 설치된 함체 ID (`enclosures.id`) |
| `switch_model_id` | BIGINT | NN, FK | 스위치 모델 ID (`switch_models.id`) |
| `name` | VARCHAR(100) | NN, UQ | 스위치 고유 이름 |
| `serial_number`| VARCHAR(255) | NN, UQ | 스위치의 고유 시리얼넘버 |
| `description` | JSON | | 설명 (예: JSON({content, images})) |

#### `devices` - 장치 정보

| 컬럼명 | 데이터 타입 | 제약조건 | 설명 |
| --- | --- | --- | --- |
| `id` | BIGINT | PK, AI | 장치 고유 ID |
| `device_type` | VARCHAR(100) | NN | 장치 종류 (e.g., 'SERVER', 'CCTV') |
| `name` | VARCHAR(100) | NN, UQ | 장치명 |
| `description` | JSON | | 설명 |

#### `ports` - 포트 정보

| 컬럼명 | 데이터 타입 | 제약조건 | 설명 |
| --- | --- | --- | --- |
| `id` | BIGINT | PK, AI | 포트 고유 ID |
| `switch_id` | BIGINT | NN, FK | 스위치 ID (`switches.id`) |
| `port_number` | INT | NN | 포트 번호 |
| `port_type` | ENUM('OPTICAL', 'LAN') | NN | 포트 타입 |
| `is_input` | BOOLEAN | | 입력 포트 여부 |
| `connected_device_id` | BIGINT | FK | 연결된 장치 ID (`devices.id`) |
| `neighbor_chassis_id` | VARCHAR(255) | | LLDP: 이웃 시스템 Chassis ID |
| `neighbor_port_id` | VARCHAR(255) | | LLDP: 이웃 포트 ID |
| `neighbor_system_name` | VARCHAR(255) | | LLDP: 이웃 시스템 이름 |
| `last_updated` | TIMESTAMP | NN | 마지막 LLDP 정보 업데이트 시간 |

## 3. 등록 시나리오
### 첫번째 시나리오, 코어링 구성
1) MDF 함체를 생성한다. (enclosure.id)
2) ODF1 함체를 생성한다. (enclosure.id)
3) ODF2 함체를 생성한다. (enclosure.id)
4) MDF<-> ODF1를 Line.fiber 24core로 연결한다. 
5) MDF.Line.fiber.core_01에 스위치(Core)를 등록하고, port_10으로 output을 설정한다. 
6) ODF1.Line.fiber.core_01에 스위치(Access)를 등록하고, port_09으로 input을 설정한다. 
7) ODF1<-> ODF2를 Line.fiber 24core로 연결한다. 
8) ODF1.Line.fiber.core_01에 스위치(Access)를 등록하고, port_10으로 output을 설정한다. 
9) ODF2.Line.fiber.core_01에 스위치(Access)를 등록하고, port_09으로 input을 설정한다. 
10) ODF1과 ODF2의 스위치에(Access)의 port_01에 각각 device(CCTV)를 연결하고, 주시설물로, port_01을 설정한다. 
11) MDF에서는 연결된 core_01의 output에 해당되는 port_10에 대한 OTDR(손실률, 길이) 정보를 가져온다.
12) MDF에서는 연결된 core_01의 output에 해당되는 port_10에 대한 LLDP 정보를 가져온다.
13) ODF에서는 연결된 core_01의 output에 해당되는 port_10에 대한 OTDR(손실률, 길이) 정보를 가져온다.
14) ODF에서는 연결된 core_01의 input에 해당되는 port_09와 output에 해당되는 port_10에 대한 LLDP 정보를 가져온다. 

<details>
<summary><strong>테이블 구조 분석</strong></summary>
<div markdown="1">

- **분석**: 각 함체와 스위치가 명확하게 정의된 점대점(Point-to-Point) 연결 및 링 구성 시나리오입니다.
- **반영 가능 여부**: **가능**
- **설명**:
  - 각 함체(`enclosures`), 스위치(`switches`), 포트(`ports`) 및 장비(`devices`)는 각각의 테이블에 직접 매핑되어 생성됩니다.
  - 함체 간의 물리적 광케이블 연결은 `fibers` 테이블로 정의됩니다.
  - 특정 케이블의 코어가 어떤 스위치의 포트와 다른 스위치의 포트를 연결하는지는 `cores` 테이블로 완벽하게 표현됩니다.
- **주요 토폴로지 지원**:
  - **P2P (Point-to-Point)**: 가장 간단한 점대점 연결은 단 하나의 `cores` 구간을 가진 `circuits` 레코드로 표현됩니다.
  - **링 (Ring/이중화)**: 시나리오 1, 3과 같은 링 구조는 여러 `cores` 구간이 동일한 `circuit_id`를 공유하고, `circuit_sequence`로 경로가 정의되어 표현됩니다. 이를 통해 이중화 경로를 포함한 전체 링 토폴로지를 명확하게 관리할 수 있습니다.
</div>
</details>

### 두번째 시나리오, MDF와 복수의 ODF를 거친 상태에서의 ODTR과 LLDP 정보 조회 
1) MDF 함체를 생성한다. (enclosure.id)
2) ODF1 함체를 생성한다. (enclosure.id)
3) ODF2 함체를 생성한다. (enclosure.id)
4) MDF<-> ODF1를 Line.fiber 24core로 연결한다. 
5) MDF.Line.fiber.core_01에 스위치(Core)를 등록하고, port_10으로 output을 설정한다. 
7) ODF1<-> ODF2를 Line.fiber 24core로 연결한다. 
9) ODF2.Line.fiber.core_01에 스위치(Access)를 등록하고, port_09으로 input을 설정한다. 
10) ODF2의 스위치에(Access)의 port_01에 device(CCTV)를 연결하고, 주시설물로, port_01을 설정한다. 
11) MDF - ODF1, fiber의 길이는 50m
12) ODF1 - ODF2, fiber의 길이는 50m 
13) MDF와 ODF2 사이에 있는 ODF1은 중간에서 두 함체를 중계하는 함체이다 
14) 이때 MDF에서는 연결된 core_01의 output에 해당되는 port_10에 대한 OTDR를 통해 가져오는 선로의 길이는 100m다. 
15) MDF.Line.fiber.core_01은 OTDR을 통해 100m 현재의 테이블 구조는 반영할 수 있으며, 
16) MDF.Line.fiber.core_01은 LLDP를 통해 해당되는 port_10에 대한 ODF2의 정보를 가져올 수 가져온다. 

<details>
<summary><strong>테이블 구조 분석</strong></summary>
<div markdown="1">

- **분석**: 중간에 스위치가 없는 패시브(Passive) 함체를 경유하는 종단 간(End-to-End) 논리 경로에 대한 시나리오입니다.
- **반영 가능 여부**: **가능** (circuits 테이블 추가 후)
- **설명**:
  - 이 시나리오는 `circuits` 테이블이 필요한 핵심적인 이유를 보여줍니다.
  - **경로 모델링**: `MDF -> ODF1 -> ODF2` 전체를 `circuits` 테이블에 **하나의 논리 회선**으로 등록합니다.
  - **거리 문제 해결**: `circuits` 레코드의 `total_otdr_distance` 필드에 종단 간 총 거리(100m)를 저장할 수 있습니다.
  - **구간 정의**: 물리적 구간인 `MDF-ODF1`와 `ODF1-ODF2`는 각각 별도의 `cores` 레코드로 생성되며, `circuit_id`를 통해 위에서 생성한 논리 회선에 연결되고 `circuit_sequence`를 통해 경로 순서(1, 2)가 정의됩니다.
  - **LLDP**: LLDP는 프로토콜의 한계로 중간 함체를 건너뛴 정보 조회가 불가능하며, 이는 테이블 구조의 문제가 아닌 기술적 제약입니다.
</div>
</details>

### 세번째 시나리오, ODF와 Fiber의 관계
1) 중간에 스위치 없는 함체(ODF)의 경우 bypass 할 수도 있고 
2) MDF -- core 24 --> ODF1(스위치 없음) 
3) ODF1(스위치 없음) -- core 12 --> ODF3(스위치)
4) ODF1(스위치 없음) -- core 12 --> ODF4(스위치)
5) ODF3(스위치) -- core 12 --> ODF5(스위치 없음)
6) ODF4(스위치) -- core 12 --> ODF5(스위치 없음)
7) ODF5(스위치 없음) -- core 24 --> MDF

<details>
<summary><strong>테이블 구조 분석</strong></summary>
<div markdown="1">

- **분석**: 하나의 케이블이 수신되어 여러 목적지로 나뉘는(분기/Fan-out) 복잡한 링(Ring) 토폴로지 시나리오입니다.
- **반영 가능 여부**: **가능**
- **설명**:
  - **분기점 모델링**: `MDF -> ODF1`로 들어온 24코어 `fiber` 내의 개별 `cores`들이 각기 다른 `circuits`에 속할 수 있습니다.
    - 예: `MDF->ODF1` 구간의 1번 코어는 `circuit_id: 1` (ODF3 방향 링)에 할당.
    - 예: `MDF->ODF1` 구간의 13번 코어는 `circuit_id: 2` (ODF4 방향 링)에 할당.
  - 이처럼 논리적 회선(`circuits`)과 물리적 광섬유 가닥(`cores`)을 분리했기 때문에, P2P, 링, 분기 등 실제 환경에서 나타나는 거의 모든 종류의 토폴로지를 유연하게 표현할 수 있습니다.
</div>
</details>

### 네번째 시나리오, MDF에서 core별 토폴로지 정의
1) MDF -- core 24.no1 --> ODF1 -- core 24.no13 --> MDF, MOF core 24.no13 -- core 24.no1
2) ...
3) MDF -- core 24.no3 --> ODF1 -- core 24.no14 --> MDF, MOF core 24.no14 -- core 24.no1
4) MDF에서 12개의 링에 대해서 확인할 수 있다. 
5) 각각의 링에는 name을 부여할 수 있다. 
6) 특정 ring에 속한 Access Switch을 나열할 수 있고, 해당 Switch에 등록된 시설물 목록(주, 보조) 추적할 수 있다.

<details>
<summary><strong>테이블 구조 분석</strong></summary>
<div markdown="1">

- **분석**: 여러 개의 독립적인 링(Ring) 토폴로지를 생성하고, 각 링을 이름으로 관리하며, 링에 속한 장비와 시설물을 추적하는 시나리오입니다.
- **반영 가능 여부**: **가능 (rings 테이블 추가 후)**
- **설명**:
  - **링 그룹화**: 신규 추가된 `rings` 테이블을 사용하여 시나리오의 "12개 링"을 각각 생성하고 이름을 부여할 수 있습니다. (예: `name: "MDF-ODF1 Ring 1"`)
  - **경로 정의**: 각 링을 구성하는 실제 경로는 `circuits` 테이블에 정의됩니다. 예를 들어, `MDF -> ODF1 -> MDF`로 이어지는 하나의 링은 하나의 `circuits` 레코드로 생성되고, `ring_id`를 통해 위에서 만든 `rings` 레코드에 소속됩니다.
  - **토폴로지 추적**:
    1. `rings` 테이블에서 이름으로 원하는 링을 찾습니다.
    2. 해당 `ring_id`를 가진 모든 `circuits`를 찾습니다.
    3. 각 `circuit_id`에 연결된 `cores`의 순서(`circuit_sequence`)를 따라 전체 경로를 파악합니다.
    4. 경로상의 `ports`와 `switches`를 조회하여 Access Switch 목록을 얻고, 최종적으로 연결된 `devices`(시설물)까지 추적할 수 있습니다.
  - 이 구조를 통해, 사용자는 '링'이라는 직관적인 단위로 복잡한 네트워크 토폴로지를 효과적으로 관리할 수 있습니다.
</div>
</details>

