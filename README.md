# Three-D-Modules 프로젝트 개요
### 🧱 pnpm 기반 Monorepo + Vite + React + TypeScript + Docker 구성

이 레포는 `pnpm` 기반의 모노레포(monorepo) 환경에서 Vite + React + TypeScript + SWC를 사용하며, 공통 패키지(`packages/shared`)와 실제 앱(`apps/project-a`)을 구분하여 관리합니다.  
또한 범용 `Dockerfile`과 `build.sh` 스크립트를 통해 효율적인 로컬 및 배포 환경을 제공합니다.
<br/>

### 목차
[첫째, 폴더 구조](#첫째-폴더-구조)<br/>
[둘째, 빠른 시작](#둘째-빠른-시작)<br/>
[셋째, Dockeer로 빌드 실행](#셋째-docker로-빌드--실행)<br/>
[넷째, Typescript 설정 계층](#넷째-typescript-설정-계층)<br/>
[다섯째, Prettier 설정](#다섯째-prettier-설정)<br/>
[여섯째, 패키지 관리](#여섯째-패키지-관리)<br/>
[일곱째, 개발자 참고사항](#일곱째-개발자-참고사항)<br/>
<br/>

## 첫째, 폴더 구조
```bash
/
├── apps/                # 실제 실행되는 앱
│   └── project-a/
│
├── packages/            # 공통 모듈 (예: shared 컴포넌트, 유틸 등)
│   └── shared/
│
├── Dockerfiles/         # 범용 도커 빌드/런타임 설정
│   ├── Dockerfile
│   └── build.sh
│
├── eslint.config.js     # 전역 ESLint 설정
├── package.json         # 루트 패키지 매니저 설정
├── pnpm-lock.yaml
├── pnpm-workspace.yaml  # pnpm workspace 범위 정의
├── tsconfig.base.json   # tsconfig 기본 설정
├── tsconfig.json        # 루트 tsconfig (extends base)
├── tsconfig.app.json    # 앱용 설정 (Vite 등에서 사용)
└── tsconfig.node.json   # Node.js 용 CLI/스크립트 실행
```
<br/>

## 둘째, 빠른 시작
### 1. 필수 도구 설치
⚠️ 루트경로에서 실행할 것<br/>
✅ pnpm 설치는 `Corepack`을 통해 버전 관리하세요<br/>
❌ 아래처럼 전역 설치하지 마세요

```bash
npm install -g pnpm
```

| 항목 | corepack 사용 시 | npm -g 사용 시 |
| :--- | :--- | :--- |
| 팀원 간 버전 통일 | ✅ 보장됨 (packageManager 기준) | ❌ 수동 설치, 불일치 가능성 |
| 버전 업그레이드 | packageManager 버전만 바꾸면 됨 | 각자 업데이트해야 함 |
| 실행 시 자동 버전 매핑 | ✅ corepack이 해줌 | ❌ 안 됨 |
| CI/CD 통합 | ✅ 안정적 | ⚠️ 각 환경마다 버전 관리 필요 |
<br/>

✅ 대신 Corepack을 사용하세요 (Node.js 16.9+ 내장)
```bash
corepack enable
corepack prepare pnpm@latest --activate
```
- package.json의 packageManager 필드에 따라 Corepack이 해당 pnpm 버전 자동 활성화
- 팀원마다 글로벌 pnpm 버전이 달라도, 실행 시점(pnpm install)에 항상 동일한 버전으로 동작
- 프로젝트 작업과 CI/CD에서 버전 차이 없이 일관된 결과 보장

### 2. 프로젝트 설치
```bash
pnpm install
```

### 3. 개발 서버 실행
⚠️ 루트경로에서 실행할 것
```bash
pnpm --filter apps/project-a dev
```
<br />

## 셋째, Docker로 빌드 & 실행
⚠️ 루트경로에서 실행할 것

### 1. 앱 빌드 실행
```bash
# 예를들어
Dockerfiles/build.sh project-a 
Dockerfiles/build.sh shared
```
<br/>

## 넷째, TypeScript 설정 계층

| 파일명 | 역할 |
| :--- | :--- |
| tsconfig.base.json | 공통 compilerOptions (최상위 설정) |
| tsconfig.json | 루트 설정 (기본적으로 base를 extend) |
| tsconfig.app.json | 앱 전용 빌드 설정 |
| tsconfig.node.json | Node CLI/스크립트용 설정 |
<br/>

## 다섯째, Prettier 설정 
### 1. 루트 package.json 스크립트 설정
```json
"scripts": {
"format": "pnpm prettier --write .",
"format:check": "pnpm exec prettier --check .",
}
```

### 2. Prettier Check & write
```bash
pnpm format:check
pnpm format
```
<br/>

## 여섯째, 패키지 관리
### 1. 특정 앱만 의존성 설치
```bash
# ⚠️ 루트경로 터미널에서 실행 
pnpm add dayjs --filter project-a

# ⚠️ 하위 페키지 터미널에서 실행
pnpm add dayjs
```
<br/>

## 일곱째, 개발자 참고사항
- shared는 앱들과 동일한 방식으로 Vite 환경에서 개발 가능
- shared를 다른 앱에서 import 시, 자동 타입 추론 + 모듈 해석 가능
    - ⚠️ 타입 선언시, 다른 앱에서 인지하도록 import 해야 함

- Dockerfile은 멀티 스테이지 빌드로 구성되어, 최종 이미지는 nginx:alpine 기반의 가볍고 빠른 컨테이너



