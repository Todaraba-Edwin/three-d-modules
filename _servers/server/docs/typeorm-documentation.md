# TypeORM 주요 사용법 및 컨벤션

이 문서는 NestJS 프로젝트에서 TypeORM의 `Repository`를 사용할 때 자주 쓰이는 주요 메서드와 옵션에 대한 사용법을 정리합니다. 이 가이드를 통해 일관되고 효율적인 데이터베이스 상호작용 코드를 작성하는 것을 목표로 합니다.

## 1. 기본 조회 메서드 (Basic Find Methods)

가장 기본적인 데이터 조회 연산입니다.

### `find()`

-   **설명**: 여러 개의 엔티티를 조회합니다. 조건을 지정하지 않으면 테이블의 모든 레코드를 가져옵니다.
-   **예시**:
    ```typescript
    // 모든 사용자 조회
    const allUsers = await this.userRepository.find();
    ```

### `findOne()`

-   **설명**: **하나의** 엔티티만 조회합니다. 주어진 조건을 만족하는 첫 번째 레코드를 반환하며, 결과가 없으면 `null`을 반환합니다.
-   **예시**:
    ```typescript
    // ID가 1인 사용자 조회
    const user = await this.userRepository.findOne({ where: { id: 1 } });
    ```

### `findOneBy()`

-   **설명**: `findOne`을 더 간결하게 사용할 수 있는 단축 구문입니다.
-   **예시**:
    ```typescript
    // ID가 1인 사용자 조회
    const user = await this.userRepository.findOneBy({ id: 1 });
    ```

### `findOneOrFail()` / `findOneByOrFail()`

-   **설명**: `findOne` 또는 `findOneBy`와 동일하게 동작하지만, 결과가 없을 경우 `null`을 반환하는 대신 `EntityNotFoundError` 에러를 발생시킵니다. NestJS의 Exception Filter와 함께 사용하면, 데이터가 없을 때 자동으로 `404 Not Found` 응답을 보낼 수 있어 편리합니다.
-   **예시**:
    ```typescript
    try {
      const user = await this.userRepository.findOneByOrFail({ id: 999 });
    } catch (error) {
      // NestJS가 자동으로 404 에러를 처리
    }
    ```

## 2. 데이터 조작 메서드 (Data Manipulation Methods)

데이터를 생성, 수정, 삭제하는 연산입니다.

### `create()`

-   **설명**: 엔티티 클래스의 **새로운 인스턴스**를 생성합니다. 이 메서드는 데이터베이스에 **저장하지 않습니다.** 클라이언트로부터 받은 DTO(Data Transfer Object)를 엔티티 객체로 변환할 때 매우 유용합니다.
-   **예시**:
    ```typescript
    const newUserDto = { name: 'John', email: 'john@example.com' };
    const newUser = this.userRepository.create(newUserDto);
    // newUser는 User 엔티티의 인스턴스이지만, 아직 DB에 저장되지 않음
    ```

### `save()`

-   **설명**: 주어진 엔티티를 데이터베이스에 저장합니다. 엔티티 인스턴스에 `id`와 같은 기본 키(Primary Key)가 없으면 새로운 레코드로 `INSERT`하고, 있으면 기존 레코드를 `UPDATE`합니다.
-   **예시**:
    ```typescript
    const savedUser = await this.userRepository.save(newUser);
    ```

### `update()`

-   **설명**: 주어진 조건에 맞는 레코드의 특정 필드들을 업데이트합니다. 엔티티를 먼저 조회하지 않고 바로 `UPDATE` 쿼리를 실행하므로 성능상 이점이 있습니다. 단, `@BeforeUpdate`와 같은 리스너나 subscriber를 트리거하지 않습니다.
-   **예시**:
    ```typescript
    // ID가 1인 사용자의 이름을 'Jane'으로 변경
    await this.userRepository.update({ id: 1 }, { name: 'Jane' });
    ```

### `delete()`

-   **설명**: 주어진 조건에 맞는 레코드를 삭제합니다. `update`와 마찬가지로 매우 효율적인 `DELETE` 쿼리를 실행합니다.
-   **예시**:
    ```typescript
    // ID가 1인 사용자 삭제
    await this.userRepository.delete(1);
    ```

## 3. 고급 조회 옵션 (Advanced Find Options)

`find` 계열의 메서드들은 다양한 옵션을 통해 강력하고 세밀한 조회를 할 수 있습니다.

### `where`

-   **설명**: 조회할 레코드의 조건을 지정합니다. `Like`, `In`, `MoreThan` 등 TypeORM이 제공하는 `FindOperator`를 함께 사용하면 복잡한 조건도 표현할 수 있습니다.
-   **예시**:
    ```typescript
    // 이름에 'John'을 포함하는 사용자 검색
    import { Like } from 'typeorm';
    const users = await this.userRepository.find({ where: { name: Like('%John%') } });
    ```

### `select`

-   **설명**: 엔티티의 특정 컬럼만 선택하여 조회합니다. 불필요한 데이터를 제외하여 페이로드 크기를 줄이고 성능을 향상시킬 수 있습니다.
-   **예시**:
    ```typescript
    // 모든 사용자의 id와 name만 조회
    const users = await this.userRepository.find({ select: { id: true, name: true } });
    ```

### `relations`

-   **설명**: **요청하신 핵심 기능입니다.** 엔티티에 `@OneToMany`, `@ManyToOne` 등으로 정의된 관계(relation)를 함께 로드(eager loading)하도록 지정합니다. TypeORM은 이 옵션을 바탕으로 내부적으로 `LEFT JOIN` 쿼리를 생성하여 한 번의 쿼리로 연관된 데이터를 모두 가져옵니다.
-   **사용법**: 두 가지 방식이 있으며, **객체 표기법**이 더 유연하고 강력하여 권장됩니다.
    1.  **문자열 배열**: `relations: ['floors', 'manager']` (1단계 깊이의 관계 로드에 적합)
    2.  **객체 표기법**: `relations: { floors: true, manager: true }` (중첩된 관계 로드 가능)

-   **예시 (bms.service.ts의 `getBuildingDetail`)**:
    ```typescript
    // `getBuildingDetail` 메서드 예시
    const building = await this.buildingRepository.findOne({
      where: { id },
      // `relations: { floors: true }`는 Building 엔티티와 연결된
      // 'floors' 속성(OneToMany 관계)을 함께 로드하라는 의미입니다.
      // SQL의 LEFT JOIN과 유사하게 동작하여, 건물 정보와 모든 층 정보를
      // 한 번의 쿼리로 효율적으로 가져옵니다.
      relations: { floors: true },
    });
    ```
-   **중첩된 관계 로드 예시**:
    객체 표기법을 사용하면 관계의 관계까지 로드할 수 있습니다.
    ```typescript
    // 건물(Building)에 속한 층(Floor)과, 그 층에 속한 공간(Space)까지 모두 조회
    const buildingWithDetails = await this.buildingRepository.findOne({
      where: { id: 1 },
      relations: {
        floors: {
          spaces: true, // floors의 spaces 관계를 로드
        },
      },
    });
    ```

### `order`

-   **설명**: 조회 결과를 정렬할 기준을 지정합니다.
-   **예시**:
    ```typescript
    // 이름을 기준으로 오름차순(ABC) 정렬
    const users = await this.userRepository.find({ order: { name: 'ASC' } });
    ```
