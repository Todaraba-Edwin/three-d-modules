# Prizm LMS - ERD (Entity-Relationship Diagram) - v3.1 (Formatting Fix)

[1. 시스템 개요](#1-시스템-개요)

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
  - [`switches` - 스위치 정보 (수정)](#switches---스위치-정보-수정)
  - [`devices` - 장치 정보](#devices---장치-정보)
  - [`ports` - 포트 정보](#ports---포트-정보)

[3. 주요 개념 및 데이터 흐름](#3-주요-개념-및-데이터-흐름)
- [3.1. Fiber와 Core의 관계: "Fiber는 N개의 Core를 가지고 있다."](#31-fiber와-core의-관계-fiber는-n개의-core를-가지고-있다)
- [3.2. Core, Circuit, Ring의 관계: "Core는 여러 스위치를 경유하여 링을 만든다."](#32-core-circuit-ring의-관계-core는-여러-스위치를-경유하여-링을-만든다)
- [3.3. Circuit과 OTDR/LLDP의 관계: "스위치 없는 함체 경유 시 Circuit이 필요하다."](#33-circuit과-otdr-lldp의-관계-스위치-없는-함체-경유-시-circuit이-필요하다)
- [3.4. Ring과 Access Switch 추적: "MDF에서 링에 속한 스위치를 순차적으로 본다."](#34-ring과-access-switch-추적-mdf에서-링에-속한-스위치를-순차적으로-본다)

[4. 등록 시나리오](#4-등록-시나리오)
- [첫번째 시나리오, 코어링 구성](#첫번째-시나리오-코어링-구성)
- [두번째 시나리오, MDF와 복수의 ODF를 거친 상태에서의 ODTR과 LLDP 정보 조회](#두번째-시나리오-mdf와-복수의-odf를-거친-상태에서의-odtr과-lldp-정보-조회)
- [세번째 시나리오, ODF와 Fiber의 관계](#세번째-시나리오-odf와-fiber의-관계)
- [네번째 시나리오, MDF에서 core별 토폴로지 정의](#네번째-시나리오-mdf에서-core별-토폴로지-정의)
- [다섯번째 시니라오, 단계별 DB 설정작업 가능성](#다섯번째-시니라오-단계별-db-설정작업-가능성)
- [여섯번째 시나리오, 비용문제 상의 한계를 대응하기](#여섯번째-시나리오-비용문제-상의-한계를-대응하기)
- [일곱번째 시나리오, 스위치 없는 코어 간 연결 (Dark Fiber)](#일곱번째-시나리오-스위치-없는-코어-간-연결-dark-fiber)


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

#### `enclosures` - 함체 정보 (수정)

| 컬럼명 | 데이터 타입 | 제약조건 | 설명 |
| --- | --- | --- | --- |
| `id` | BIGINT | PK, AI | 함체 고유 ID |
| `space_id` | BIGINT | FK | 설치된 공간 ID (`spaces.id`) |
| `name` | VARCHAR(100) | NN | 함체명 (예: 메인배전함, 중간배전함) |
| `type` | ENUM('MDF', 'ODF', 'OFD', 'FDF', 'IDF') | | 배전함 종류 |
| `parent_enclosure_id` | BIGINT | FK | 상위 배전함_id |
| `location` | JSON | NN | 3D 공간 내 좌표 JSON({lat, log, height}) |
| `description` | JSON | | 설명 (예: JSON({content, images})) |

#### `lines` - 선로 정보 (수정)

| 컬럼명 | 데이터 타입 | 제약조건 | 설명 |
| --- | --- | --- | --- |
| `id` | BIGINT | PK, AI | 선로의 고유 ID |
| `type` | ENUM('FIBER', 'ELECTRONIC') | NN | 선로 타입 (광선로, 전기선로 등) |

> **`fibers`와 `cores`의 관계**
> - `fibers` 테이블은 **물리적인 광케이블**이 어떤 **함체(Enclosure)**와 어떤 **함체** 사이에 설치되었는지를 정의합니다. (거시적, 물리적 경로)
> - `cores` 테이블은 그 케이블 내 **개별 광섬유 가닥**이 A 함체의 **스위치 포트(Port)**와 B 함체의 **스위치 포트**를 어떻게 연결하는지를 정의합니다. (미시적, 논리적 신호 경로)

#### `fibers` - 광케이블 정보 (수정)

| 컬럼명 | 데이터 타입 | 제약조건 | 설명 |
| --- | --- | --- | --- |
| `line_id` | BIGINT | PK, FK | 선로 ID (`lines.id`) |
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

#### `switches` - 스위치 정보 (수정)

| 컬럼명 | 데이터 타입 | 제약조건 | 설명 |
| --- | --- | --- | --- |
| `id` | BIGINT | PK, AI | 스위치 고유 ID |
| `enclosure_id` | BIGINT | NN, FK | 설치된 함체 ID (`enclosures.id`) |
| `switch_model_id` | BIGINT | NN, FK | 스위치 모델 ID (`switch_models.id`) |
| `name` | VARCHAR(100) | NN, UQ | 스위치 고유 이름 |
| `serial_number`| VARCHAR(255) | NN, UQ | 스위치의 고유 시리얼넘버 |
| `form_factor` | ENUM('INTERNAL', 'EXTERNAL') | | **스위치 형태 (내장/외장)** |
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

## 3. 주요 개념 및 데이터 흐름
이 섹션은 ERD의 핵심 테이블인 `Fibers`, `Cores`, `Circuits`, `Rings`가 어떻게 상호작용하여 복잡한 광케이블 네트워크를 모델링하는지 설명합니다.

### 3.1. Fiber와 Core의 관계: "Fiber는 N개의 Core를 가지고 있다."
- **설명**: 이 관계는 `fibers`와 `cores` 테이블을 통해 표현됩니다. `fibers` 테이블의 `core_count` 컬럼이 광케이블 내의 물리적인 코어 가닥 수를 정의하고, `cores` 테이블의 `fiber_id`가 각 코어 가닥이 어떤 광케이블에 속하는지를 명시하여 **1:N 관계**를 형성합니다.
- **상호작용**: `fibers` 레코드 하나 (ID: 10, core_count: 24)는 `cores` 테이블에서 `fiber_id`가 10인 레코드 24개와 연결됩니다.

### 3.2. Core, Circuit, Ring의 관계: "Core는 여러 스위치를 경유하여 링을 만든다."
- **정의**: 정확히는, 물리적 구간인 **`Core`** 여러 개를 논리적으로 엮어 **`Circuit`(회선)**을 만들고, 이 `Circuit`이 여러 스위치를 경유하여 **`Ring`**을 구성합니다.
- **상호작용**:
  1. `A-B` 구간의 `core-1`과 `B-C` 구간의 `core-2`가 있습니다.
  2. 이 둘을 묶어 `A-B-C` 경로를 표현하는 `circuits` 레코드(ID: 500)를 생성합니다.
  3. `core-1`과 `core-2`의 `circuit_id`를 `500`으로 설정하고, `circuit_sequence`를 각각 1과 2로 부여하여 경로의 순서를 정의합니다.
  4. 각 `core`는 `from_port_id`, `to_port_id`를 통해 `ports`에 연결되고, `ports`는 `switch_id`를 통해 `switches`에 연결됩니다.
  5. 최종적으로 이 `circuits` 레코드에 `ring_id`를 부여하여 특정 `rings` 그룹에 소속시킬 수 있습니다.

### 3.3. Circuit과 OTDR/LLDP의 관계: "스위치 없는 함체 경유 시 Circuit이 필요하다."
- **설명**: `Circuit` 개념은 특히 스위치가 없는 패시브(Passive) 구간을 관리할 때 핵심적인 역할을 합니다.
- **상호작용**:
  - **OTDR**: `MDF -> ODF(패시브) -> IDF` 경로에서, 각 `cores` 레코드는 `MDF-ODF`, `ODF-IDF` 구간의 거리만 가집니다. 이 `cores`들을 하나의 `circuits`로 묶고, `circuits.total_otdr_distance` 컬럼에 **종단 간 전체 거리**를 저장하여 구간별 측정값과 전체 경로 측정값을 모두 관리할 수 있습니다.
  - **LLDP**: LLDP는 직접 연결된 스위치만 탐지하므로 `ODF` 너머를 볼 수 없습니다. `Circuit`은 LLDP가 제공하지 못하는 **실제 종단 간 연결 정보**를 시스템에 제공하여 정보의 공백을 메웁니다.

### 3.4. Ring과 Access Switch 추적: "MDF에서 링에 속한 스위치를 순차적으로 본다."
- **설명**: 네, 이것이 `rings` 테이블의 핵심 기능입니다.
- **상호작용**:
  1. **`rings` 조회**: `rings.name`으로 원하는 링의 `id`를 찾습니다.
  2. **`circuits` 조회**: `rings.id`를 이용해 해당 링에 속한 모든 `circuits`를 찾습니다.
  3. **`cores` 조회**: 각 `circuits.id`를 이용해 소속된 `cores`를 `circuit_sequence` 순으로 정렬합니다.
  4. **`ports` & `switches` 조회**: 정렬된 `cores`의 `port` 정보를 통해 최종적으로 연결된 `switches`의 목록을 순서대로 얻을 수 있습니다.

## 4. 등록 시나리오
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

### 다섯번째 시니라오, 단계별 DB 설정작업 가능성
1) 함체(MDF)를 생성한다. 
2) 함체(IDF)를 생성한다. 
3) MDF - IDF를 연결할 line.fiber를 생성하느데 코어의 수는 24로 한다. 
4) 이떼 line, fiber, core 테이블에 해당 정보가 생성된다. fiber 등록에서 24코어를 생성하면, cores에 해당 fiber_id 로 24개의 core가 생성된다. 
5) MDF에서는 1개의 fiber 하위에 24 개의 core를 볼 수 있게된다. 
6) 개별 core에는 switch를 등록할 수 있다. 
7) switch를 등록하면, 제조사를 기반으로 광포트와 랜포트가 생성되며 해당 숫자만음의 ports 테이플에 값이 생성된다. 
8) 연결테스를 통해서 해당 port의 값을 업데이트 한다. 연결정포에 대한 상태
9) 개별 core에 연결된 switch 정보를 통해서 core의 ODTR 정보와, 해당 스위치의 port별 LLDP 정보를 조회할 수 있다. 
10) 별도로 core의 연결정보를 생성하지 않더라도, 해당 값을 스위치와 통신하여 알아낼 수 있게 된다. 
11) MDF 사이에 스위치 없는 함체(ODF)를 생성하여 Fiber를 연결하더라도 ring 구성도를 추적할 수 있게 된다. 
12) 스위치없는 함체(ODF)에서는 이전 함체와 다음 함체의 값을 조회하여, 해당 core가 어떤 스위치와 연결되어 있는지 알아낼 수 있다. 

<details>
<summary><strong>테이블 구조 분석</strong></summary>
<div markdown="1">

- **분석**: 데이터베이스 등록 절차와 자동화, 그리고 동적 정보 조회의 가능성을 탐문하는 고급 시나리오입니다. 제안된 동작 방식은 현재의 ERD 설계와 완벽하게 부합하며, 이 시스템이 어떻게 활용될 수 있는지를 잘 보여줍니다.
- **반영 가능 여부**: **완벽하게 가능**
- **설명**:
  - **자동 코어 생성 (4번 항목)**: `fibers` 테이블에 `core_count`를 기반으로 `cores` 레코드를 자동으로 생성하는 것은 애플리케이션 레벨에서 구현할 훌륭한 기능이며, 현재 스키마는 이를 완벽히 지원합니다.
  - **스위치 포트 자동 생성 (7번 항목)**: `switch_models`의 `port_info` JSON을 기반으로 `switches` 등록 시 `ports`를 자동으로 생성하는 것 또한 현재 스키마가 의도한 핵심 기능 중 하나입니다.
  - **동적 정보 조회 (10번 항목)**: LLDP와 같은 프로토콜을 통해 스위치와 통신하여 연결 정보를 알아내고, 그 결과를 `ports` 및 `cores` 테이블에 업데이트하는 방식은 시스템의 활용도를 크게 높일 수 있습니다. 데이터베이스는 이렇게 동적으로 수집된 토폴로지 정보를 저장할 준비가 되어 있습니다.
  - **경로 추적 (11, 12번 항목)**: `circuits`와 `rings` 테이블의 도입으로, 스위치가 없는 패시브 함체를 경유하는 복잡한 경로도 문제없이 추적하고 관리할 수 있습니다. 이는 현재 ERD 설계의 핵심 장점입니다.

- **결론**: 제안해주신 다섯 번째 시나리오는 현재의 ERD가 충분히 견고하고 확장 가능하며, 의도된 워크플로우를 모두 지원할 수 있음을 명확하게 보여줍니다. 해당 기획은 충분히 실현 가능합니다.
</div>
</details>

### 여섯번째 시나리오, 비용문제 상의 한계를 대응하기 
1) 비용상의 문제로, MDF에 스위치를 설치하지 못함
2) 추적해야 하는 Devic에는 Access Switch를 부착함(내장, 외장) # 스위치가 내장인지 외장인지 컬럼 추가
3) Switch의 L1,L2,L3 계층에서 추적하지 못하는 core 연결에 대해서는 수동으로 부여 가능여부 판단하기 

<details>
<summary><strong>테이블 구조 분석</strong></summary>
<div markdown="1">

- **분석**: 비용 및 기술적 제약으로 인해 발생하는 현실적인 한계에 대응하는 시나리오입니다. 스위치의 물리적 형태를 구분하고, 자동화된 추적이 불가능할 때 수동으로 연결 정보를 관리하는 기능의 필요성을 다룹니다.
- **반영 가능 여부**: **가능 (컬럼 추가 후)**
- **설명**:
  - **스위치 형태 구분 (2번 항목)**: 매우 중요한 지적입니다. 장비에 내장된 스위치와 별도로 설치된 외장 스위치를 구분하기 위해, `switches` 테이블에 `form_factor` ENUM('INTERNAL', 'EXTERNAL') 컬럼을 추가하는 것이 좋겠습니다. 제안해주신 대로 스키마를 수정하면 이 요구사항을 완벽하게 반영할 수 있습니다.
  - **수동 연결 정의 (3번 항목)**: 현재 데이터 모델은 수동 관리를 완벽하게 지원합니다. 자동화된 프로토콜(LLDP 등)로 연결을 파악할 수 없는 경우, 관리자가 직접 `cores` 테이블의 `from_port_id`와 `to_port_id` 값을 지정하여 두 포트 간의 연결을 명시적으로 정의할 수 있습니다. 이는 시스템의 핵심 기능 중 하나입니다.

- **결론**: 제안해주신 시나리오는 현실적인 운영 환경을 잘 반영하고 있습니다. `switches` 테이블에 `form_factor` 컬럼을 추가하면, 시나리오의 모든 요구사항을 만족시킬 수 있습니다.
</div>
</details> 

### 일곱번째 시나리오, 스위치 없는 코어 간 연결 (Dark Fiber)
1) A 함체와 B 함체 사이에 12코어 광케이블(Fiber-A)을 설치한다.
2) B 함체와 C 함체 사이에 12코어 광케이블(Fiber-B)을 설치한다.
3) 현재 A, B, C 함체에는 스위치가 전혀 설치되지 않았다.
4) B 함체 내부에서, Fiber-A의 1번 코어와 Fiber-B의 1번 코어를 물리적으로 접속(Splicing/Patching)한다.
5) 이 때, A함체부터 C함체까지 이어지는 하나의 '연결'을 시스템에 등록하고 싶다.

<details>
<summary><strong>테이블 구조 분석</strong></summary>
<div markdown="1">

- **분석**: 스위치나 포트가 없는 상태에서, 함체 내에서 코어와 코어가 직접 연결되는(패시브 연결) 경우를 모델링하는 시나리오입니다. 이는 'Dark Fiber' 관리의 핵심적인 부분입니다.
- **반영 가능 여부**: **완벽하게 가능**
- **설명**:
  - 이 시나리오는 `circuits` (논리 회선) 테이블의 핵심적인 역할을 보여줍니다. `cores` 테이블이 물리적인 광섬유 가닥 그 자체를 의미한다면, `circuits` 테이블은 이 가닥들이 어떻게 논리적으로 연결되어 종단 간(End-to-End) 경로를 만드는지를 정의합니다.
  - **모델링 방법**:
    1. `Fiber-A (A->B)`와 `Fiber-B (B->C)`에 대한 정보를 각각 `fibers` 테이블에 생성합니다.
    2. 각 fiber에 속한 1번 코어 정보를 `cores` 테이블에 생성합니다. 이때 이 코어들은 스위치에 연결되지 않았으므로 `from_port_id`와 `to_port_id`는 `NULL`이 됩니다.
    3. `A->B->C`로 이어지는 전체 경로를 나타내는 **하나의 `circuits` 레코드**를 생성합니다. (예: `circuits.id = 100`)
    4. `Fiber-A`의 1번 코어 레코드에 `circuit_id = 100`, `circuit_sequence = 1`을 설정합니다.
    5. `Fiber-B`의 1번 코어 레코드에 `circuit_id = 100`, `circuit_sequence = 2`를 설정합니다.
  - **결론**: 위와 같이 `circuits` 테이블을 사용하면, `cores` 레코드들을 순서대로 엮어 스위치 존재 여부와 상관없이 물리적인 종단 간 경로를 완벽하게 표현하고 추적할 수 있습니다. 나중에 A 함체와 C 함체에 스위치가 설치되면, 해당 `circuits`의 첫 번째와 마지막 `cores` 레코드의 `from_port_id`와 `to_port_id`만 업데이트해주면 됩니다.
</div>
</details>