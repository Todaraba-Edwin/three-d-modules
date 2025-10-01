import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as API from '@src_apps/modules/_api';
import { Request } from 'express';
import { AuthService } from './auth.service';

/**
 * @summary 기본 인증 가드
 * @description 요청에 포함된 세션 쿠키의 유효성을 검사합니다.
 * 인증에 성공하면, 세션 정보를 request 객체의 `user` 속성에 담아 다음 핸들러로 전달합니다.
 * @throws {UnauthorizedException} 세션이 없거나 유효하지 않을 경우
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const sessionId = request.cookies[API.AUTH.COOKIES.SESSION_ID];

    if (!sessionId) {
      throw new UnauthorizedException(
        API.API_MESSAGES.AUTH.NOT_FOUND_SESSION_BROWSER,
      );
    }

    const validationResult =
      await this.authService.getValidateSession(sessionId);

    if (!validationResult.isValid) {
      throw new UnauthorizedException(validationResult.message);
    }

    // 인증 성공 시, request 객체에 사용자 정보를 추가
    request.user = validationResult;
    return true;
  }
}

/**
 * @summary 관리자 권한 확인 가드
 * @description AuthGuard를 상속받아 기본 인증을 수행한 후, 관리자 역할(role)인지 추가로 확인합니다.
 * @extends AuthGuard
 * @throws {UnauthorizedException} 관리자 권한이 아닐 경우
 */
@Injectable()
export class AuthAdminGuard extends AuthGuard {
  constructor(authService: AuthService) {
    super(authService); // 부모 클래스의 생성자 호출
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. 부모 AuthGuard의 canActivate를 실행하여 기본 인증을 수행하고 request.user에 세션 정보를 담습니다.
    await super.canActivate(context);

    // 2. 부모 가드에서 request에 담아준 사용자 정보를 가져옵니다.
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user;

    // 3. 관리자 권한 확인 로직만 수행합니다.
    if (user?.roleCode !== 'ADMIN_MAIN') {
      throw new UnauthorizedException(API.API_MESSAGES.AUTH.NOT_ADMIN_SESSION);
    }

    return true;
  }
}
