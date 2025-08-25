import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { compare } from 'bcrypt';
import { randomBytes } from 'crypto';
import { log } from 'node:console';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  private activeSessions = new Map<string, { sessionId: string }>();
  constructor(private usersService: UsersService) {}

  async login(
    username: string,
    password: string,
    force: boolean = false,
  ): Promise<{ message: string; username: string; sessionId?: string }> {
    const user = await this.usersService.findOneByUsername(username);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordMatching = await compare(password, user.password);
    log('Password comparison result:', isPasswordMatching);

    if (!isPasswordMatching) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (this.activeSessions.has(username) && !force) {
      throw new ConflictException('User already logged in');
    }

    const sessionId = randomBytes(16).toString('hex');
    this.activeSessions.set(username, { sessionId });

    return { message: 'Login successful', username: user.username, sessionId };
  }

  validateSession(username: string, sessionId: string): boolean {
    console.log('sessionId', sessionId);

    const userSession = this.activeSessions.get(username);
    console.log('userSession:', userSession);

    return !!userSession && userSession.sessionId === sessionId;
  }

  logout(username: string) {
    this.activeSessions.delete(username);
    return { message: 'Logout successful' };
  }
}
