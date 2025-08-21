import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() body) {
    // NOTE: This is a placeholder for the actual login logic.
    return this.authService.login(body.username, body.password);
  }
}
