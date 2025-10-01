# API 관리 컨벤션

이 문서는 NestJS 백엔드 애플리케이션에서 API 관련 상수(경로, 메시지, 설정 등)를 관리하는 컨벤션을 정의합니다. 이 컨벤션을 따름으로써 코드의 일관성, 가독성 및 유지보수성을 향상시킬 수 있습니다.

## 1. 관리 대상

API 관련 상수는 `servers/server/src/common/api/` 디렉토리 내의 파일에서 중앙 관리합니다.

-   `apiPaths.ts`: API 경로, URL 파라미터 이름, 쿠키 이름
-   `apiMessages.ts`: API 응답으로 사용될 모든 사용자 대상 메시지
-   `apiConfig.ts`: 쿠키 설정 등 API 동작에 필요한 설정값

이 상수들은 `index.ts`를 통해 `import * as API from '@src_apps/common/api'` 형태로 한번에 가져와 사용하는 것을 권장합니다.

## 2. `apiPaths.ts` - 경로 및 이름 정의

모든 API 경로 세그먼트, URL 파라미터, 쿠키 이름 등을 정의합니다.

### 구조

```typescript
// servers/server/src/common/api/apiPaths.ts

export const API_PREFIX = 'api';

export const USERS = {
  SEGMENTS: { // URL 경로의 고정된 부분
    BASE: 'users',
    TYPE: 'type',
  },
  PARAMS: { // URL 파라미터의 이름 (e.g., /:userName)
    USERNAME: 'userName',
    USERTYPE: 'userType',
  },
};

export const AUTH = {
  SEGMENTS: {
    BASE: 'auth',
    LOGIN: 'login',
    VALIDATE_SESSION: 'validate-session',
  },
  COOKIES: { // 쿠키의 이름
    SESSION_ID: 'sessionId',
    USER_NAME: 'username',
  },
};
```

### 컨트롤러에서의 사용

```typescript
// servers/server/src/modules/users/users.controller.ts
import * as API from '@src_apps/common/api';

@Controller(`${API.API_PREFIX}/${API.USERS.SEGMENTS.BASE}`) // /api/users
export class UsersController {
  @Get(`:${API.USERS.PARAMS.USERNAME}`) // /api/users/:userName
  findOne(@Param(API.USERS.PARAMS.USERNAME) userName: string) {
    // ...
  }
}
```

## 3. `apiMessages.ts` - 응답 메시지 정의

API가 반환하는 모든 문자열 메시지를 한 곳에서 관리하여 일관성을 유지하고 다국어 지원을 용이하게 합니다.

### 구조

```typescript
// servers/server/src/common/api/apiMessages.ts

export const API_MESSAGES = {
  AUTH: {
    SUCCEED_LOGIN: '로그인을 성공했습니다.',
    INVALID_USERS: '로그인 정보(사용자)가 유효하지 않습니다.',
  },
  USERS: {
    NOT_FOUND: '사용자를 찾을 수 없습니다.',
  }
};
```

### 서비스에서의 사용

```typescript
// servers/server/src/modules/auth/auth.service.ts
import { API_MESSAGES } from '@src_apps/common/api';

// ...
throw new UnauthorizedException(API_MESSAGES.AUTH.INVALID_USERS);
```

## 4. `apiConfig.ts` - API 설정 정의

쿠키 옵션과 같이 API 동작에 필요한 설정들을 상수로 관리합니다.

### 구조

```typescript
// servers/server/src/common/api/apiConfig.ts
import type { CookieOptions } from 'express';

const cookieMaxAge = 1000 * 60 * 60 * 24 * 7; // 7 DAY;

// httpOnly 옵션이 포함된, 민감한 정보를 위한 쿠키 설정
export const HTTP_ONLY_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: cookieMaxAge,
  path: '/',
};

// 클라이언트 스크립트에서 접근해야 할 쿠키를 위한 기본 설정
export const DEFAULT_COOKIE_OPTIONS: CookieOptions = {
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: cookieMaxAge,
  path: '/',
};
```

### 컨트롤러에서의 사용

```typescript
// servers/server/src/modules/auth/auth.controller.ts
import * as API from '@src_apps/common/api';

// ...
res.cookie(
  API.AUTH.COOKIES.SESSION_ID,
  sessionId,
  API.HTTP_ONLY_COOKIE_OPTIONS, // 혹은 DEFAULT_COOKIE_OPTIONS
);
```