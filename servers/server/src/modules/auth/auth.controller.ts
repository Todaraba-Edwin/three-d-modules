import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { API_PREFIX, AUTH } from '../../common/apiPaths';
import { AuthService } from './auth.service';
import { log } from 'node:console';

@Controller(`${API_PREFIX}/${AUTH.SEGMENTS.BASE}`)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(AUTH.SEGMENTS.LOGIN)
  async login(
    @Body() body: { username: string; password: string; force?: boolean },
    @Res({ passthrough: true }) res: Response,
  ) {
    const loginResult = await this.authService.login(
      body.username,
      body.password,
      body.force,
    );

    if (loginResult.sessionId) {
      res.cookie('sessionId', loginResult.sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        path: '/',
      });
      res.cookie('username', loginResult.username, {
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        path: '/',
      });
    }

    return { message: loginResult.message, username: loginResult.username };
  }

  @Get('validate-session')
  validateSession(@Req() req: Request) {
    const { username, sessionId } = req.cookies;

    if (!username || !sessionId) {
      throw new UnauthorizedException('Session information not found in cookies');
    }

    const isValid = this.authService.validateSession(username, sessionId);
    console.log('isValid', isValid);
    
    if (!isValid) {
      throw new UnauthorizedException('Invalid session');
    }
    return { message: 'Session is valid', username };
  }

  @Post('logout')
  logout(
    @Body() body: { username: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    this.authService.logout(body.username);
    res.clearCookie('sessionId', { path: '/' });
    res.clearCookie('username', { path: '/' });
    return { message: 'Logout successful' };
  }
}
