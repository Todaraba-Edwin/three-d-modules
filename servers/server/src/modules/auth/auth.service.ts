import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  login(username, password) {
    // NOTE: Implement actual authentication logic here.
    return { message: 'Login successful', username };
  }
}
