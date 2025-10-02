# API 관리 컨벤션

이 문서는 NestJS 백엔드 애플리케이션에서 API 관련 상수(경로, 메시지, 설정 등)를 관리하는 컨벤션을 정의합니다. 이 컨벤션을 따름으로써 코드의 일관성, 가독성 및 유지보수성을 향상시킬 수 있습니다.

## 1. 표준 API 응답 구조

모든 API 응답은 일관성 유지를 위해 아래와 같은 `{ message, data }` 구조를 따르는 것을 원칙으로 합니다. `data`가 필요 없는 경우 `{ message }`만 반환할 수 있습니다.

이를 위해 `_servers/server/src/modules/_api/api.dto.ts`에 정의된 `ResultDto`를 기반으로 각 API의 응답 DTO를 작성합니다.

### 기본 응답 DTO (`ResultDto`)

```typescript
// _servers/server/src/modules/_api/api.dto.ts
export class ResultDto {
  @IsString()
  @IsNotEmpty()
  message: string;
}
```

### 확장 사용 예시 (`SummaryResult`)

데이터를 포함하는 응답의 경우, `ResultDto`를 상속하고 `data` 프로퍼티를 추가하여 응답 DTO를 정의합니다.

```typescript
// _servers/server/src/modules/system-admin/dto/system-admin.dto.ts
import { ResultDto } from '@src_apps/modules/_api';

// ...
class SummaryResDto { ... }

export class SummaryResult extends ResultDto {
  data: SummaryResDto;
}
```

### 서비스에서의 반환 예시

서비스 메소드는 최종적으로 컨트롤러가 반환할 응답 DTO 객체를 생성하여 반환합니다.

```typescript
// _servers/server/src/modules/system-admin/system-admin.service.ts
async getSummary(): Promise<Dto.SummaryResult> {
  // ... 데이터 조회 로직 ...
  return {
    message: API_MESSAGES.ADMIN.SUMMARY,
    data: { ... },
  };
}
```

## 2. API 상수 중앙 관리

API 관련 상수는 `_servers/server/src/modules/_api/` 디렉토리 내의 파일에서 중앙 관리합니다.

-   `apiPaths.ts`: API 경로, URL 파라미터 이름, 쿠키 이름
-   `apiMessages.ts`: API 응답 메시지 (`ResultDto`의 `message` 필드에 사용)
-   `kyCookieOptions.ts`: 쿠키 설정 등 API 동작에 필요한 설정값
-   `api.dto.ts`: 여러 모듈에서 공통으로 사용하는 DTO (e.g. `ResultDto`)

이 상수들은 `index.ts`를 통해 `import * as API from '@src_apps/modules/_api'` 형태로 한번에 가져와 사용하는 것을 권장합니다.

### 2.1. `apiPaths.ts` - 경로 및 이름 정의

모든 API 경로 세그먼트, URL 파라미터, 쿠키 이름 등을 정의합니다.

**구조:**
```typescript
// _servers/server/src/modules/_api/apiPaths.ts
export const API_PREFIX = 'api';

export const USERS = {
  SEGMENTS: { // URL 경로의 고정된 부분
    BASE: 'users',
    TYPE: 'type',
  },
  PARAMS: { // URL 파라미터의 이름 (e.g., /:userName)
    USERNAME: 'userName',
  },
};
```

**컨트롤러에서의 사용:**
```typescript
// _servers/server/src/modules/users/users.controller.ts
import * as API from '@src_apps/modules/_api';

@Controller(`${API.API_PREFIX}/${API.USERS.SEGMENTS.BASE}`) // /api/users
export class UsersController {
  @Get(`:${API.USERS.PARAMS.USERNAME}`)
  findOne(@Param(API.USERS.PARAMS.USERNAME) userName: string) { ... }
}
```

### 2.2. `apiMessages.ts` - 응답 메시지 정의

API가 반환하는 모든 문자열 메시지를 한 곳에서 관리하여 일관성을 유지합니다.

**구조:**
```typescript
// _servers/server/src/modules/_api/apiMessages.ts
export const API_MESSAGES = {
  AUTH: {
    SUCCEED_LOGIN: '로그인을 성공했습니다.',
  },
  USERS: {
    CREATE_USER: '새로운 사용자를 생성했습니다.',
  }
};
```

### 2.3. `kyCookieOptions.ts` - API 설정 정의

쿠키 옵션과 같이 API 동작에 필요한 설정들을 상수로 관리합니다.

**구조:**
```typescript
// _servers/server/src/modules/_api/kyCookieOptions.ts
import type { CookieOptions } from 'express';

// httpOnly 옵션이 포함된, 민감한 정보를 위한 쿠키 설정
export const HTTP_ONLY_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  // ...
};
```