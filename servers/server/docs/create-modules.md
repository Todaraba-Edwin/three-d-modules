# NestJS 모듈 생성 컨벤션

이 문서는 새로운 NestJS 모듈을 생성할 때 따라야 할 구조, 네이밍, 코드 스타일 등의 컨벤션을 정의합니다.

## 1. 모듈 기본 구조

새로운 모듈(예: `products`)은 `servers/server/src/modules/` 디렉토리 하위에 생성되며, 다음과 같은 기본 구조를 따릅니다.

```
/servers/server/src/modules/
└── products/
    ├── dto/                    # 데이터 구조 정의 (엔티티, 인터페이스, DTO) 폴더
    │   ├── product.entity.ts
    │   ├── product.interface.ts
    │   └── index.ts
    ├── products.controller.ts    # 컨트롤러
    ├── products.module.ts        # 모듈 정의
    ├── products.service.ts       # 서비스 (비즈니스 로직)
    └── index.ts                  # 모듈 export
```

-   **`dto/`**: 모듈에서 사용되는 모든 데이터 구조(엔티티, 인터페이스, DTO, enum 등)를 정의하는 파일을 그룹화합니다. `index.ts`를 통해 모두 export 합니다.
    -   **`*.interface.ts`**: 데이터베이스에 직접적으로 종속되지 않는 순수한 데이터 구조(enum, DTO 클래스 등)를 정의합니다.
    -   **`*.entity.ts`**: 데이터베이스 테이블과 매핑되는 TypeORM 엔티티 클래스를 정의합니다. `*.interface.ts`에 정의된 enum 등을 가져와 사용할 수 있습니다.
-   **`*.controller.ts`**: HTTP 요청/응답 처리를 담당하며, 요청 Body는 반드시 `dto` 폴더에 정의된 DTO 클래스로 받아야 합니다.
-   **`*.service.ts`**: 핵심 비즈니스 로직을 담당합니다.
-   **`*.module.ts`**: 모듈의 구성요소(컨트롤러, 서비스, 의존성)를 정의합니다.
-   **`index.ts`**: 외부에서 모듈을 쉽게 가져올 수 있도록 `products.module.ts`를 export 합니다.

## 2. 네이밍 컨벤션

-   **모듈**: 파스칼 케이스 + `Module` 접미사 (예: `ProductsModule`)
-   **컨트롤러**: 파스칼 케이스 + `Controller` 접미사 (예: `ProductsController`)
-   **서비스**: 파스칼 케이스 + `Service` 접미사 (예: `ProductsService`)
-   **엔티티**: 파스칼 케이스, 단수형 (예: `Product`)
-   **DTO**: 파스칼 케이스 + `Dto` 접미사 (예: `CreateProductDto`)

## 3. 서비스 메서드 명명 규칙

서비스의 공개(public) 메서드는 역할에 따라 다음과 같은 접두사를 사용하는 것을 원칙으로 합니다.

-   **`get`**: 데이터를 조회하는 메서드 (예: `getProductById`, `getAllProducts`)
-   **`set`**: 데이터를 생성하거나 수정하는 메서드 (예: `setProduct`, `updateProductInfo`)
-   **`delete`**: 데이터를 삭제하는 메서드 (예: `deleteProduct`)

**예외**: `login`, `logout`과 같이 도메인 로직 상 더 명확한 이름이 있는 경우는 예외로 합니다.

## 4. JSDoc 주석

-   **모든 컨트롤러 및 서비스의 `public` 메서드에는 반드시 JSDoc 주석을 작성해야 합니다.**
-   주석은 간결한 개조식으로 작성하는 것을 원칙으로 합니다.
-   **Controller**: `@summary`에 `HTTP 메서드`와 `엔드포인트 경로`, 그리고 간단한 설명을 포함합니다. (예: `@summary POST /api/products - 신규 제품 생성`)
-   **Service**: `@summary`에 메서드의 핵심 역할을 기술합니다.
-   `@param`, `@returns`, `@throws` 등을 사용해 함수의 명세를 명확히 합니다.

## 5. API 상수 사용

-   API 경로, 파라미터 이름, 쿠키 이름, 응답 메시지 등 모든 상수는 `servers/server/src/common/api/`에 정의된 값을 사용해야 합니다.
-   컨트롤러 상단에서 `import * as API from '@src_apps/common/api';` 구문을 통해 한번에 임포트하여 사용합니다.

이 컨벤션을 준수하여 일관성 있고 예측 가능한 코드를 작성하고, 협업 효율성을 높일 수 있습니다.
