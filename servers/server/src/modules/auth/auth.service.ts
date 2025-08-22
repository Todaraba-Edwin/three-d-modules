import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { compare } from 'bcrypt';
import { log } from 'node:console';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async login(username: string, password: string): Promise<{ message: string; username: string }> {
    const user = await this.usersService.findOneByUsername(username);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordMatching = await compare(password, user.password);
    log('Password comparison result:', isPasswordMatching);

    if (!isPasswordMatching) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return { message: 'Login successful', username: user.username };
  }
}
