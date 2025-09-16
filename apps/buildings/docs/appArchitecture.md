# `@apps/buildings` 아키텍처 문서

## 목차

- [`src` 디렉토리 구조](#src-디렉토리-구조)
  - [`src/_templates`](#1-srctemplates)
  - [`src/01_pages`](#2-src01_pages)
  - [`src/02_common`](#3-src02_common)
- [FSD (Feature-Sliced Design) 와 `@packages/shared`](#fsd-feature-sliced-design-와-packagesshared)
- [기술 아키텍처 상세](#기술-아키텍처-상세)
  - [API 클라이언트와 데이터 캐싱](#api-클라이언트와-데이터-캐싱)
  - [권한 기반 동적 라우팅](#권한-기반-동적-라우팅)
    - [중첩 라우팅과 상태 유지](#중첩-라우팅과-상태-유지)

이 문서는 `@apps/buildings` 애플리케이션의 프론트엔드 아키텍처를 설명함.

## `src` 디렉토리 구조

`@apps/buildings/src` 디렉토리는 기능적 관심사에 따라 다음과 같이 세 개의 주요 폴더로 구성됨.

### 1. `src/_templates`

애플리케이션의 핵심적인 초기 설정과 전역적인 템플릿을 관리함. 주로 앱이 시작될 때 필요한 기본 환경을 설정하는 역할.

-   **주요 역할 및 구조**:
    -   **Provider 설정**: React Context Provider를 설정하여 하위 컴포넌트에 전역 상태나 기능을 제공.
        -   `_templates/CookiesTemplates.tsx`: 쿠키 관련 Provider 설정.
        -   `_templates/QueryProviderTemplates.tsx`: React Query(`@tanstack/react-query`) Provider 설정.
    -   **라우팅 설정**: React Router를 설정하고, 페이지 접근 권한을 제어하는 로더 등을 정의.
        -   `_templates/loader/router.tsx`: 애플리케이션의 전체 라우트 구조를 정의.
        -   `_templates/loader/ProtectedLayout.tsx`: 인증이 필요한 라우트를 감싸는 레이아웃 컴포넌트. `loader`를 통해 접근 권한을 확인.
        -   `_templates/loader/loaders.ts`: 각 라우트 진입 전에 데이터를 미리 로드하거나 인증 상태를 확인하는 로더 함수 정의.
    -   **전역 레이아웃**: `ProtectedLayout`과 같이 특정 라우트 그룹에 공통적으로 적용될 레이아웃을 정의.

### 2. `src/01_pages`

애플리케이션의 각 페이지를 정의하는 공간. **FSD (Feature-Sliced Design)** 아키텍처를 채택하여 페이지를 기능 단위로 명확하게 분리하고 재사용성을 높임.

-   **주요 특징 및 구조**:
    -   각 페이지는 자체적인 라우트(e.g., `AuthRouter`, `DefaultRouter`)를 기준으로 디렉토리가 생성됨.
    -   페이지 내부는 FSD의 레이어(`_wigets`, `features`, `_shared`)에 따라 구조화됨.
    -   **폴더 구조 예시**:
        ```
        01_pages/
        ├── AuthRouter/         # 인증 관련 페이지
        │   ├── AuthRouter.tsx
        │   └── _wigets/
        │       └── Login.tsx   # 로그인 UI 위젯
        ├── CesiumRouter/       # Cesium 지도 관련 페이지
        │   ├── CesiumLayout.tsx
        │   └── CesiumRouter.tsx
        └── DefaultRouter/      # 일반 애플리케이션 페이지
            ├── DefaultRouter.tsx
            ├── _wigets/        # 페이지의 특정 섹션을 구성하는 위젯
            │   └── SystemAdmin/
            │       ├── entities/       # 비즈니스 로직과 API 호출을 캡슐화하는 훅
            │       │   └── useDeleteRole.ts
            │       └── features/       # 위젯보다 작은 단위의 기능
            │           └── UserManagement/
            └── features/       # 위젯보다 작은 단위의 기능
                └── UserManagement/
        ```
    -   복잡한 페이지(`DefaultRouter`)의 경우, 하위에 `SystemAdmin`과 같은 더 작은 기능 단위(feature)를 포함하며, 이 기능 단위 역시 자체적인 FSD 구조를 가질 수 있음.

### 3. `src/02_common`

애플리케이션 전반에서 사용되는 공통 모듈을 관리하는 공간. 특정 페이지나 기능에 종속되지 않는 재사용 가능한 코드들이 위치함.

-   **주요 역할 및 구조**:
    -   `apiClient.ts`: 서버와 통신하기 위한 HTTP 클라이언트(`ky`) 인스턴스 설정 및 인터셉터 정의.
    -   `Button.tsx`: 여러 곳에서 재사용되는 기본 UI 컴포넌트.
    -   `queryKey.ts`: `@tanstack/react-query`에서 사용할 쿼리 키를 생성하는 팩토리 함수 관리.
    -   `zustandStores/useAuthStore.ts`: `Zustand`를 사용한 전역 상태(e.g., 인증 토큰, 사용자 정보) 저장소 정의.
    -   `type.d.ts`: 프로젝트 전반에서 사용되는 공통 타입 정의.

## FSD (Feature-Sliced Design) 와 `@packages/shared`

`01_pages` 디렉토리는 FSD 방법론을 따르며, 이는 코드의 응집도를 높이고 유지보수성을 향상시킴.

-   **페이지 중심 설계**: 각 페이지(`AuthRouter`, `DefaultRouter`)는 독립적인 단위로 구성.
-   **위젯 (`_wigets`)**: 여러 `features`나 `entities`를 조합하여 만드는 독립적인 UI 블록. 예: `AuthRouter/_wigets/Login.tsx`는 로그인 페이지의 전체 UI를 구성하는 위젯.
-   **엔티티 (`entities`)**: 비즈니스 로직과 API 호출을 캡슐화하는 계층. 주로 `useQuery`나 `useMutation`을 사용한 커스텀 훅 형태로 작성되어, 컴포넌트로부터 데이터 페칭 로직을 분리함. 예: `useDeleteRole.ts`는 역할 삭제 API 호출과 관련된 상태 관리(성공, 실패, 로딩)를 처리.
-   **기능 공유 (`@packages/shared`)**:
    -   FSD의 `shared` 레이어 개념을 모노레포의 `@packages/shared` 패키지로 확장하여 사용.
    -   `@packages/shared/src/features/_shared`: 여러 애플리케이션(`apps/buildings` 등)에서 공통으로 사용될 수 있는 저수준 유틸리티, 훅(hook), 공통 타입(e.g., `utilsThrottle`) 등을 포함.
    -   `@packages/shared/src/features/Cesium`: 여러 애플리케이션에서 공통으로 사용하는 Cesium 관련 컴포넌트, 훅, 유틸리티 등을 정의.
    -   이를 통해 애플리케이션 간 코드 중복을 최소화하고 일관성을 유지.

## 기술 아키텍처 상세

### API 클라이언트와 데이터 캐싱

본 애플리케이션은 `ky`를 HTTP 클라이언트로 사용하며, 이는 `src/02_common/apiClient.ts`에 설정되어 있음.

-   **`ky` 클라이언트 설정**:
    -   `prefixUrl`: 모든 API 요청의 기본 URL을 설정.
    -   `credentials: '''include'''`: 인증을 위해 모든 요청에 자동으로 쿠키를 포함.
    -   `hooks.afterResponse`: 전역 응답 훅을 설정. API 응답이 `401 Unauthorized`일 경우, 세션이 만료된 것으로 간주하여 자동으로 로그인 페이지(`/login`)로 리디렉션함.

-   **`@tanstack/query`를 이용한 데이터 캐싱**:
    -   서버 상태 관리는 `@tanstack/query` (React Query)를 통해 이루어짐.
    -   `useQuery` 훅을 사용하여 데이터를 가져오고 캐싱하며, UI 상태와 서버 상태를 동기화함.
    -   **캐싱 정책 예시** (`SystemAdminSummary.tsx`):
        -   `staleTime`: 데이터가 '''fresh''' 상태로 유지되는 시간. 이 시간 내에는 네트워크 요청이 다시 발생하지 않고 캐시된 데이터를 사용. (예: `30 * 1000` // 30초)
        -   `refetchInterval`: 특정 시간 간격으로 데이터를 자동으로 다시 가져와 UI를 최신 상태로 유지. (예: `40 * 1000` // 40초)
    -   이러한 캐싱 전략을 통해 불필요한 API 호출을 줄이고 사용자 경험을 향상시킴.

### 권한 기반 동적 라우팅

본 애플리케이션은 정적 라우팅이 아닌, 서버로부터 받은 권한에 따라 동적으로 라우트를 제어하는 정책을 채택하여 높은 수준의 보안과 유연성을 확보함.

-   **동작 방식 상세**:

    1.  **프론트엔드 메뉴 정의 (`const.ts`)**:
        -   먼저 프론트엔드에서는 애플리케이션에 존재할 수 있는 모든 메뉴의 경로를 `menuLists` 배열에 정적으로 정의함 (`@/pages/DefaultRouter/_shared/const.ts`). 이는 시스템의 전체 네비게이션 구조를 나타냄.

    2.  **백엔드 권한 정보 조회 (`users.service.ts`)**:
        -   사용자가 로그인하면, 서버는 해당 사용자의 `role_id`를 기반으로 `getMenuPermissionByRoleId` 함수를 호출함.
        -   이 함수는 DB의 `menus` 테이블과 `role_menu_permissions` 테이블을 조인하여, 프론트엔드의 모든 메뉴(`menuLists`에 대응)에 대해 현재 사용자가 접근 가능한지를 나타내는 `can_access: boolean` 플래그가 포함된 배열을 반환함.

    3.  **권한 상태 저장 (`useAuthStore`)**:
        -   백엔드로부터 받은 권한 배열은 프론트엔드의 전역 상태 관리자인 `Zustand`의 `useAuthStore`에 저장되어, 애플리케이션 전역에서 사용될 수 있게 됨.

    4.  **동적 라우트 생성 및 보호 (`DefaultRouter.tsx`)**:
        -   `DefaultRouter.tsx`에서는 `menuLists`를 기반으로 `react-router-dom`의 `RouteObject`를 동적으로 생성함.
        -   이때 각 라우트의 `element`는 일반 페이지 컴포넌트가 아닌, 권한 검사를 수행하는 `PermittedRoute`라는 특수한 컴포넌트로 감싸짐.

    5.  **`PermittedRoute` 가드 컴포넌트**:
        -   `PermittedRoute`는 일종의 '''라우트 가드(Route Guard)''' 역할을 수행함.
        -   컴포넌트가 렌더링되면, `useAuthStore`에서 현재 사용자의 권한 배열을 가져옴.
        -   자신이 렌더링해야 할 경로(`validationPath`)가 권한 배열 내에 존재하는지, 그리고 `can_access`가 `true`인지 확인.
        -   만약 권한이 없다면, `useEffect`를 통해 사용자를 이전 페이지(`navigate(-1)`)로 돌려보내거나, 방문 기록이 없는 경우 안전하게 기본 경로(`/`)로 리디렉션함.

-   **아키텍처 장점**:
    -   **관심사의 분리 (SoC)**: UI 렌더링과 권한 검증의 책임이 명확하게 분리됨. 각 페이지 컴포넌트는 자신의 컨텐츠를 렌더링하는 데만 집중할 수 있으며, 권한 확인 로직은 `PermittedRoute`에 캡슐화됨.
    -   **중앙화된 권한 관리**: 라우팅 계층에서 모든 권한을 일괄적으로 처리하므로, 권한 정책의 변경 및 유지보수가 매우 용이함. 새로운 메뉴가 추가되거나 권한 정책이 변경될 때, `PermittedRoute` 수정 없이 백엔드 DB와 프론트엔드의 `menuLists`만 관리하면 됨.
    -   **안정성 및 보안 강화**: 개발자가 각 페이지 컴포넌트에서 개별적으로 권한 검사 로직을 구현할 때 발생할 수 있는 휴먼 에러나 누락을 원천적으로 차단함. 이로써 더욱 안정적이고 예측 가능한 보안 아키텍처를 구현.

#### 중첩 라우팅과 상태 유지

`SystemAdmin.tsx` 위젯은 중첩 라우팅을 활용하여 자체적인 탭(Tab) 인터페이스를 관리하고, 페이지 새로고침에도 상태를 안정적으로 유지하는 전략을 보여주는 좋은 예시임.

-   **URL을 통한 상태 관리**:
    -   `SystemAdmin` 내의 탭("사용자 관리", "장비 관리")은 단순한 UI 상태가 아닌, `react-router-dom`의 `NavLink` 컴포넌트를 통해 각각의 하위 경로(`/system-admin`, `/system-admin/device`)와 연결됨.
    -   사용자가 탭을 클릭하면, URL이 변경되고 이 URL이 현재 UI 상태의 '''단일 진실 공급원(Single Source of Truth)''' 역할을 수행함.

-   **`Outlet`을 활용한 컨텐츠 렌더링**:
    -   `SystemAdmin.tsx`는 탭 UI 아래에 `<Outlet />` 컴포넌트를 배치함.
    -   `react-router`는 현재 URL에 매칭되는 자식 라우트(예: `UserManagement` 또는 `DeviceManagement` 컴포넌트)를 이 `<Outlet />` 위치에 렌더링함.

-   **새로고침 대응 전략**:
    1.  사용자가 `/system-admin/device` 경로에서 페이지를 새로고침.
    2.  브라우저가 로드되면, `react-router`는 현재 URL(`/system-admin/device`)을 읽음.
    3.  라우터 설정(`DefaultRouter.tsx`)에 따라, 먼저 부모 라우트인 `SystemAdmin` 컴포넌트를 렌더링함.
    4.  동시에, `SystemAdmin` 내의 `NavLink`는 현재 URL을 확인하고 '장비 관리' 탭에 `isActive` 스타일을 자동으로 적용함.
    5.  마지막으로, 라우터는 URL에 해당하는 자식 컴포넌트인 `DeviceManagement`를 `<Outlet />`에 렌더링함.

-   **아키텍처 장점**:
    -   이러한 URL 기반 상태 관리 방식은 `localStorage`나 별도의 상태 관리 라이브러리 없이도, UI의 상태(활성화된 탭, 표시된 컨텐츠)를 완벽하게 보존하고 복원함.
    -   결과적으로 북마크가 가능하고, 다른 사용자와 URL을 공유할 수 있는 예측 가능하고 안정적인 사용자 경험을 제공함.
