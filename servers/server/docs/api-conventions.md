# API 경로 및 파라미터 관리 컨벤션

이 문서는 NestJS 백엔드 애플리케이션에서 API 경로 및 URL 파라미터를 관리하는 컨벤션을 정의합니다. 이 컨벤션을 따름으로써 코드의 일관성, 가독성 및 유지보수성을 향상시킬 수 있습니다.

## 1. API 경로 상수 파일

모든 API 경로 세그먼트 및 URL 파라미터 이름은 `servers/server-a/src/common/apiPaths.ts` 파일에 상수로 정의됩니다.

### `apiPaths.ts` 구조

```typescript
// servers/server-a/src/common/apiPaths.ts

export const API_PREFIX = 'api'; // 모든 API의 기본 접두사

export const USERS = { // 특정 도메인(예: 사용자) 관련 경로 및 파라미터 그룹
  SEGMENTS: { // URL 경로의 고정된 부분 (세그먼트)
    BASE: 'users', // 기본 경로 세그먼트 (예: /api/users)
    TYPE: 'type',  // 하위 경로 세그먼트 (예: /api/users/type)
  },
  PARAMS: { // URL 파라미터의 이름
    USERNAME: 'userName', // 사용자 이름 파라미터 이름 (예: :userName)
    USERTYPE: 'userType', // 사용자 유형 파라미터 이름 (예: :userType)
  },
};

// 다른 도메인(예: PRODUCTS)도 유사한 구조로 추가될 수 있습니다.
/*
export const PRODUCTS = {
  SEGMENTS: {
    BASE: 'products',
    CATEGORY: 'category',
  },
  PARAMS: {
    PRODUCT_ID: 'productId',
    CATEGORY_NAME: 'categoryName',
  },
};
*/
```

## 2. 컨트롤러에서의 사용

컨트롤러에서는 `apiPaths.ts`에 정의된 상수들을 가져와 `@Controller()` 및 `@Get()` 데코레이터, 그리고 `@Param()` 데코레이터에서 사용합니다.

### 예시: `UsersController`

```typescript
// servers/server-a/src/users/users.controller.ts

import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
// ...
import { API_PREFIX, USERS } from '../common/apiPaths'; // apiPaths.ts에서 상수 가져오기

// 컨트롤러의 기본 경로 정의
@Controller(`${API_PREFIX}/${USERS.SEGMENTS.BASE}`) // 예: /api/users
export class UsersController {
  // ...

  // 특정 사용자 조회 (예: GET /api/users/:userName)
  @Get(`:${USERS.PARAMS.USERNAME}`) // URL 경로에 파라미터 이름 사용
  findOne(@Param(USERS.PARAMS.USERNAME) userName: string): User {
    // ...
  }

  // 사용자 유형별 조회 (예: GET /api/users/type/:userType)
  @Get(`${USERS.SEGMENTS.TYPE}/:${USERS.PARAMS.USERTYPE}`) // 세그먼트와 파라미터 조합
  findByUserType(@Param(USERS.PARAMS.USERTYPE) userType: UserType): User[] {
    // ...
  }
}
```

## 3. 컨벤션 준수 이유

*   **일관성**: 모든 API 경로 및 파라미터가 통일된 방식으로 정의되어 코드 베이스 전체의 일관성을 유지합니다.
*   **가독성**: "마법의 문자열" 대신 의미 있는 상수를 사용하여 코드의 의도를 명확하게 전달합니다.
*   **유지보수성**: 경로 또는 파라미터 이름 변경 시, `apiPaths.ts` 파일 한 곳만 수정하면 되므로 리팩토링이 용이합니다.
*   **오류 감소**: 오타로 인한 경로 불일치 등의 오류 발생 가능성을 줄입니다.
