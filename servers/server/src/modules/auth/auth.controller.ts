import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import * as API from '@src_apps/common/api';
import dayjs from 'dayjs';
import type { Request, Response } from 'express';
import { UAParser } from 'ua-parser-js';
import { AuthService } from './auth.service';

/**
 * @description Request 헤더의 User-Agent를 파싱하여 "브라우저이름 버전 on OS이름"
 * 형태의 클라이언트 식별 시그니처를 생성합니다.
 * @param userAgent - Request 헤더의 User-Agent 문자열
 * @returns 파싱된 클라이언트 시그니처 문자열
 */
const createClientSignature = (
  userAgent: string | undefined,
  originHost: any,
) => {
  if (!userAgent) return 'Unknown';
  const parser = new UAParser(userAgent);
  const { browser, os, device } = parser.getResult();

  return JSON.stringify({
    device: `${device}(${os.name})`,
    originHost,
    loginDate: dayjs(),
  });
};

@Controller(`${API.API_PREFIX}/${API.AUTH.SEGMENTS.BASE}`)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * @summary POST /api/auth/login - 사용자 로그인
   * @description 사용자 로그인을 처리하고, 성공 시 세션 쿠키(sessionId, username)를 설정.
   * @param req - 요청 객체 (User-Agent 획득을 위해 사용)
   * @param body - 로그인 정보 (username, password, force)
   * @param res - 응답 객체 (쿠키 설정을 위해 사용)
   * @returns 로그인 결과 메시지와 사용자 이름 객체
   */
  @Post(API.AUTH.SEGMENTS.LOGIN)
  async login(
    @Req() req: Request,
    @Body() body: { username: string; password: string; force?: boolean },
    @Res({ passthrough: true }) res: Response,
  ) {
    const clientSignature = createClientSignature(
      req.headers['user-agent'],
      req.headers['origin'],
    );
    const loginResult = await this.authService.login(
      body.username,
      body.password,
      body.force,
      clientSignature,
    );

    const { message, sessionId, username } = loginResult;
    // const origin = req.headers['origin'];
    // let cookieDomain: string | undefined;
    // if (origin) {
    //   try {
    //     cookieDomain = new URL(origin).hostname;
    //   } catch (e) {
    //     console.error('Invalid Origin header, cannot set cookie domain', e);
    //     cookieDomain = undefined;
    //   }
    // }

    // console.log('cookieDomain', cookieDomain);

    if (sessionId) {
      res.cookie(
        API.AUTH.COOKIES.SESSION_ID,
        sessionId,
        API.HTTP_ONLY_COOKIE_OPTIONS,
      );
      res.cookie(
        API.AUTH.COOKIES.USER_NAME,
        username,
        API.DEFAULT_COOKIE_OPTIONS,
      );
    }

    return { message, username };
  }

  /**
   * @summary GET /api/auth/validate-session - 세션 유효성 검증
   * @description 브라우저에 저장된 쿠키를 이용해 현재 세션의 유효성을 검증.
   * @param req - 요청 객체 (쿠키 정보 및 User-Agent 획득을 위해 사용)
   * @returns 세션이 유효할 경우, 성공 메시지와 사용자 이름 객체
   * @throws {UnauthorizedException} 쿠키가 없거나 서버의 세션 정보와 일치하지 않을 경우 (HTTP 401)
   */
  @Get(API.AUTH.SEGMENTS.VALIDATE_SESSION)
  getValidateSession(@Req() req: Request) {
    const { username, sessionId } = req.cookies;
    const clientSignature = createClientSignature(
      req.headers['user-agent'],
      req.headers['origin'],
    );

    if (!username || !sessionId) {
      throw new UnauthorizedException(
        API.API_MESSAGES.AUTH.NOT_FOUND_SESSION_BROWSER,
      );
    }

    const validationResult = this.authService.getValidateSession(
      username,
      sessionId,
      clientSignature,
    );

    if (!validationResult.isValid) {
      // 커스텀 에러 응답 Body 생성
      const errorResponse = {
        statusCode: 401,
        message: API.API_MESSAGES.AUTH.NOT_FOUND_SESSION_SERVER,
        storedClientSignature: JSON.parse(
          validationResult.storedClientSignature || '',
        ),
      };
      throw new UnauthorizedException(errorResponse);
    }
    return { message: API.API_MESSAGES.AUTH.VALID_SESSION, username };
  }

  /**
   * @summary POST /api/auth/logout - 사용자 로그아웃
   * @description 사용자 로그아웃을 처리하고, 브라우저의 세션 관련 쿠키를 삭제.
   * @param body - 로그아웃할 사용자 이름
   * @param res - 응답 객체 (쿠키 삭제를 위해 사용)
   * @returns 로그아웃 성공 메시지 객체
   */
  @Post(API.AUTH.SEGMENTS.lOGOUT)
  async logout(
    // @Body() body: { username: string },
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    const { username, sessionId } = req.cookies;
    const validationResult = this.authService.getValidateSession(
      username,
      sessionId,
      '',
    );

    if (!validationResult.isValid) {
      throw new UnauthorizedException(
        API.API_MESSAGES.AUTH.NOT_FOUND_SESSION_SERVER,
      );
    }

    const logoutResult = await this.authService.logout(username);
    const { message } = logoutResult;
    res.clearCookie(API.AUTH.COOKIES.SESSION_ID, { path: '/' });
    res.clearCookie(API.AUTH.COOKIES.USER_NAME, { path: '/' });
    return { message };
  }
}
