import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as API from '@src_apps/common/api';
import { Request } from 'express';
import { AuthService } from './auth.service';

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
    return true;
  }
}

@Injectable()
export class AuthAdminGuard implements CanActivate {
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

    if (validationResult.roleCode != 'ADMIN_MAIN') {
      throw new UnauthorizedException(API.API_MESSAGES.AUTH.NOT_ADMIN_SESSION);
    }
    return true;
  }
}
