import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { API_PREFIX, AUTH } from '../../common/apiPaths';

@Controller(`${API_PREFIX}/${AUTH.SEGMENTS.BASE}`)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(AUTH.SEGMENTS.LOGIN)
  login(@Body() body) {
    // NOTE: This is a placeholder for the actual login logic.
    return this.authService.login(body.username, body.password);
  }
}
