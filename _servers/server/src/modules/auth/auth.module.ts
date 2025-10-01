import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthAdminGuard, AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

/**
 * @summary 인증 및 권한 부여 모듈
 * @description 사용자 인증(로그인/로그아웃), 세션 유효성 검사, 라우트 가드(Guard) 기능을 담당.
 * 1️⃣ imports      : 다른 모듈에서 가져와 사용자 provider에 등록
 * 2️⃣ controllers  : API 엔드포인트를 처리하는 로직을 등록
 * 3️⃣ providers    : 핵심 로직(AuthService), 라우트 접근 제어(AuthGuard, AuthAdminGuard) 등록
 * 4️⃣ exports      : 다른 모듈에서 사용할 provider를 내보내기.
 */
@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [AuthGuard, AuthAdminGuard, AuthService],
  exports: [AuthGuard, AuthAdminGuard, AuthService],
})
export class AuthModule {}
