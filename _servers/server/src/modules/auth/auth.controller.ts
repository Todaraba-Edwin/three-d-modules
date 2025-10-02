import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import * as API from '@src_apps/modules/_api';
import dayjs from 'dayjs';
import type { Request, Response } from 'express';
import { UAParser } from 'ua-parser-js';
import { AuthService } from './auth.service';

const { SEGMENTS, COOKIES } = API.AUTH;

/**
 * @description Request 헤더의 User-Agent를 파싱하여 "브라우저이름 버전 on OS이름"
 * TODO : 추후 로그인 관련 log를 사용하기 위한 도입
 * 형태의 클라이언트 식별 시그니처를 생성합니다.
 * @param userAgent - Request 헤더의 User-Agent 문자열
 * @returns 파싱된 클라이언트 시그니처 문자열
 */
const createClientSignature = (
  userAgent: string | undefined,
  originHost: string | undefined | null,
) => {
  if (!userAgent) return 'Unknown';
  const parser = new UAParser(userAgent);
  const { os, device } = parser.getResult();

  return JSON.stringify({
    device: `${device}(${os.name})`,
    originHost,
    loginDate: dayjs(),
  });
};

@Controller(SEGMENTS.BASE)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * @summary POST /api/auth/login - 사용자 로그인
   * @description 사용자 로그인을 처리하고, 성공 시 HttpOnly 세션 쿠키(sessionId)를 설정.
   * @param req - 요청 객체 (User-Agent 획득을 위해 사용)
   * @param body - 로그인 정보 (username, password, force)
   * @param res - 응답 객체 (쿠키 설정을 위해 사용)
   * @returns 로그인 결과 메시지
   */
  @Post(SEGMENTS.LOGIN)
  async login(
    @Req() req: Request,
    @Body() body: LoginReqBodyType,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResResultType> {
    const clientSignature = createClientSignature(
      req.headers['user-agent'],
      req.headers['origin'],
    );
    const { message, sessionId } = await this.authService.login({
      ...body,
      clientSignature,
    });

    res.cookie(
      API.AUTH.COOKIES.SESSION_ID,
      sessionId,
      API.HTTP_ONLY_COOKIE_OPTIONS,
    );

    return { message };
  }

  /**
   * @summary POST /api/auth/logout - 사용자 로그아웃
   * @description 사용자 로그아웃을 처리하고, 브라우저의 세션 쿠키를 삭제.
   * @param req - 요청 객체 (쿠키 정보 획득을 위해 사용)
   * @param res - 응답 객체 (쿠키 삭제를 위해 사용)
   * @returns 로그아웃 성공 메시지 객체
   */
  @Post(API.AUTH.SEGMENTS.lOGOUT)
  async logout(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ): Promise<ResResultType> {
    const sessionId = req.cookies[COOKIES.SESSION_ID];
    if (sessionId) this.authService.logout(sessionId);

    res.clearCookie(COOKIES.SESSION_ID, { path: API.CookiesPath });
    const result = { message: API.API_MESSAGES.AUTH.SUCCEED_LOGOUT };
    return result;
  }

  /**
   * @summary GET /api/auth/validate-session - 세션 유효성 검증
   * @description 브라우저에 저장된 쿠키를 이용해 현재 세션의 유효성을 검증.
   * @param req - 요청 객체 (쿠키 정보 획득을 위해 사용)
   * @returns 세션이 유효할 경우, 성공 메시지와 사용자 정보 객체
   * @throws {UnauthorizedException} 쿠키가 없거나 서버의 세션 정보와 일치하지 않을 경우 (HTTP 401)
   */
  @Get(SEGMENTS.VALIDATE_SESSION)
  async getValidateSession(
    @Req() req: Request,
  ): Promise<ValidateSessionResultType> {
    const sessionId = req.cookies[COOKIES.SESSION_ID];

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

    const { message, roleCode, nickname, permissions } = validationResult;

    return {
      message,
      roleCode,
      nickname,
      permissions,
    };
  }
}
