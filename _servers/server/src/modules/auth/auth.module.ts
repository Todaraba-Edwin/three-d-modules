import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthAdminGuard, AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

/**
 * @summary 인증 및 권한 부여 모듈
 * @description 사용자 인증, 세션 검사, 라우트 가드(Guard) 기능 담당.
 *
 * @property imports
 *   - `UsersModule` 같은 다른 모듈을 임포트함.
 *   - 임포트된 모듈이 `export`하는 프로바이더(예: `UsersService`)를
 *     이 모듈 내 서비스(예: `AuthService`)에서 주입받아 사용 가능하게 됨.
 *   - ❗️참고: 서비스 클래스에서 의존성 타입을 사용하려면,
 *     TypeScript 타입 검사를 위해 파일 상단에서 `import` 구문이 반드시 필요함.
 *
 * @property controllers
 *   - API 엔드포인트를 처리할 `AuthController` 등록.
 *
 * @property providers
 *   - 핵심 로직(`AuthService`) 및 가드(`AuthGuard` 등)를
 *     NestJS DI 컨테이너에 프로바이더로 등록.
 *
 * @property exports
 *   - `providers`로 등록된 프로바이더 중, 다른 모듈에서 사용될 것들을 외부로 공개함.
 */
@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [AuthGuard, AuthAdminGuard, AuthService],
  exports: [AuthGuard, AuthAdminGuard, AuthService],
})
export class AuthModule {}
