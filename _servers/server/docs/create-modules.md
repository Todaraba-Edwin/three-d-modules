# NestJS 모듈 생성 및 관리 컨벤션

이 문서는 새로운 NestJS 모듈을 생성하고 관리할 때 따라야 할 구조, 네이밍, 코드 스타일 등의 컨벤션을 정의합니다.

## 1. 모듈 기본 구조

새로운 모듈(예: `products`)은 `_servers/server/src/modules/` 디렉토리 하위에 생성되며, 다음과 같은 기본 구조를 따릅니다.

```
/modules/
└── products/
    ├── dto/
    │   ├── index.ts
    │   └── products.dto.ts
    ├── entities/
    │   ├── index.ts
    │   └── product.entity.ts
    ├── products.controller.ts
    ├── products.module.ts
    ├── products.service.ts
    └── index.ts
```

-   **`entities/`**: 데이터베이스 테이블과 1:1로 매핑되는 TypeORM 엔티티(`@Entity`) 클래스를 정의합니다.
    -   `index.ts`에서 모든 엔티티를 `export` 합니다.
-   **`dto/`**: 계층 간 데이터 전송에 사용되는 DTO(Data Transfer Object) 클래스를 정의합니다.
    -   모든 DTO는 `*.dto.ts` 단일 파일에서 관리하는 것을 원칙으로 합니다.
    -   `class-validator` 데코레이터를 사용하여 유효성 검사 규칙을 명시해야 합니다.
    -   `index.ts`에서 `*.dto.ts` 파일을 `export` 합니다.
-   **`*.controller.ts`**: HTTP 요청/응답 처리를 담당하며, 서비스 계층에 로직을 위임합니다.
-   **`*.service.ts`**: 핵심 비즈니스 로직을 담당합니다.
-   **`*.module.ts`**: 모듈의 구성요소(컨트롤러, 서비스, 의존성)를 정의합니다.
-   **`index.ts`**: `products.module.ts`를 `export`하여 다른 모듈에서 쉽게 임포트할 수 있도록 합니다.

## 2. DTO 및 엔티티 임포트 컨벤션

컨트롤러와 서비스에서 DTO와 엔티티를 가져올 때, 네임스페이스 임포트를 사용하여 출처를 명확히 합니다.

```typescript
// products.service.ts
import * as Dto from './dto';
import * as Entities from './entities';

// ...
async createProduct(productData: Dto.CreateProductReqDto): Promise<Entities.Product> {
  // ...
}
```

## 3. 네이밍 컨벤션

-   **모듈**: 파스칼 케이스 + `Module` 접미사 (예: `ProductsModule`)
-   **컨트롤러**: 파스칼 케이스 + `Controller` 접미사 (예: `ProductsController`)
-   **서비스**: 파스칼 케이스 + `Service` 접미사 (예: `ProductsService`)
-   **엔티티**: 파스칼 케이스, 단수형 (예: `Product`)
-   **DTO**: 역할에 따라 접미사를 명확히 구분합니다.
    -   요청(Request) DTO: `...ReqDto` (예: `CreateProductReqDto`)
    -   응답(Result) DTO: `...ResultDto` (예: `CreateProductResultDto`)

## 4. JSDoc 주석

-   모든 컨트롤러 및 서비스의 `public` 메서드에는 반드시 JSDoc 주석을 작성합니다.
-   주석은 간결한 개조식으로 작성하는 것을 원칙으로 합니다.
-   **Controller**: `@summary`에 `HTTP 메서드`와 `엔드포인트 경로`, 그리고 간단한 설명을 포함합니다. (예: `@summary POST /api/products - 신규 제품 생성`)
-   **Service**: `@summary`에 메서드의 핵심 역할을 기술합니다.
-   `@param`, `@returns`, `@throws` 등을 사용해 함수의 명세를 명확히 합니다.

## 5. API 및 공통 상수 사용

-   API 경로, 공통 메시지, 쿠키 설정 등 여러 모듈에서 사용되는 상수는 `_servers/server/src/modules/_api/`에 정의된 값을 사용해야 합니다.
-   컨트롤러 상단에서 `import * as API from '@src_apps/modules/_api';` 구문을 통해 한번에 임포트하여 사용합니다.

## 6. 모듈 특화 상수 관리

모듈 내부에서만 사용되는 상수는 모듈의 `const/` 디렉토리에서 관리하여 캡슐화를 유지합니다. (선택사항)

-   **`const` 객체**: 에러 메시지, SNMP OID 등 성격이 다른 값들의 그룹화에 사용합니다.
-   **`enum`**: 상태 코드, 포트 타입 등 정해진 값의 집합에 사용합니다.
