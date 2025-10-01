# Nest.js Server for three-d-modules

이 프로젝트는 `three-d-modules` pnpm 모노레포 내의 Nest.js 기반 서버입니다. 사용자 인증 및 데이터 관리를 위한 API를 제공합니다.

## ✨ 주요 기능

-   **사용자 인증**: 세션 기반의 로그인, 로그아웃 및 세션 유효성 검사
-   **사용자 관리**: 사용자 생성 및 정보 조회
-   **중앙화된 API 상수**: `common/api` 디렉토리를 통한 API 경로, 메시지, 설정의 중앙 관리
-   **TypeORM 연동**: `mariadb` 데이터베이스와의 연동

## 📚 프로젝트 구조 및 컨벤션

이 프로젝트는 체계적인 개발을 위해 명확한 구조와 컨벤션을 따릅니다. 자세한 내용은 아래의 내부 문서를 참고해주세요.

-   **[API 관리 컨벤션](./docs/api-conventions.md)**: API 경로, 메시지, 설정 등 상수 관리 규칙에 대해 설명합니다.
-   **[모듈 생성 컨벤션](./docs/create-modules.md)**: 신규 모듈의 파일 구조, 네이밍, 코드 스타일 규칙에 대해 설명합니다.

## ⚙️ 환경 설정

이 프로젝트는 `.env` 파일을 통해 환경 변수를 관리합니다. `servers/server` 디렉토리 루트에 `.env` 파일을 생성하고 아래 내용을 참고하여 작성해주세요.

```env
# .env.example

# 서버 포트
APP_PORT=8081

# 데이터베이스 연결 정보
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
DB_DATABASE=your_db_name
```

## 🚀 시작하기

### 1. 의존성 설치

이 프로젝트는 pnpm 워크스페이스의 일부입니다. **프로젝트 루트 디렉토리**에서 아래 명령어를 실행하여 모든 의존성을 설치하세요.

```bash
$ pnpm install
```

### 2. 애플리케이션 실행

`servers/server` 디렉토리에서 아래 스크립트를 실행할 수 있습니다.

```bash
# 개발 모드 (파일 변경 감지)
$ pnpm run start:dev

# 프로덕션 모드
$ pnpm run start:prod

# 디버그 모드
$ pnpm run start:debug
```

## ✅ 테스트

```bash
# 유닛 테스트
$ pnpm run test

# E2E 테스트
$ pnpm run test:e2e

# 테스트 커버리지
$ pnpm run test:cov
```

## 🛠️ 주요 기술 스택

-   **Framework**: [NestJS](https://nestjs.com/)
-   **Database**: [TypeORM](https://typeorm.io/) with MariaDB/MySQL
-   **Authentication**: Session-based with Cookies
-   **Validation**: DTO with `class-validator` (권장)
-   **Package Manager**: [pnpm](https://pnpm.io/)