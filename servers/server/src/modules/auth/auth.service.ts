import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { API_MESSAGES } from '@src_apps/common/api';
import { compare } from 'bcrypt';
import { randomBytes } from 'crypto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  private activeSessions = new Map<
    string,
    { sessionId: string; clientSignature: string }
  >();
  constructor(private usersService: UsersService) {}

  /**
   * @summary 사용자 로그인 처리 및 세션 생성
   * @description
   * 1. 사용자 정보(이름, 비밀번호) 유효성 검사
   * 2. (force=false인 경우) 기존 활성 세션 확인으로 중복 로그인 방지
   * 3. 유효성 검사 통과 시, 새 세션 ID 생성 및 저장
   *
   * @param username - 사용자 이름
   * @param password - 사용자 비밀번호
   * @param force - 중복 로그인 허용 여부 (true일 경우 기존 세션 덮어씀)
   * @param clientSignature - 클라이언트 식별 시그니처 (예: "Chrome on macOS")
   *
   * @returns 로그인 성공 시, 성공 메시지, 사용자 이름, 세션 ID 객체 반환
   *
   * @throws {UnauthorizedException} 사용자 정보 불일치 시 (HTTP 401)
   * @throws {ConflictException} 이미 로그인 상태(force=false)일 시 (HTTP 409)
   */
  async login(
    username: string,
    password: string,
    force: boolean = false,
    clientSignature: string,
  ): Promise<{ message: string; username: string; sessionId?: string }> {
    const user = await this.usersService.getUserByUsername(username);

    if (!user) {
      throw new UnauthorizedException(API_MESSAGES.AUTH.INVALID_USERS);
    }

    const isPasswordMatching = await compare(password, user.password);

    if (!isPasswordMatching) {
      throw new UnauthorizedException(API_MESSAGES.AUTH.INVALID_PASSWORD);
    }

    if (this.activeSessions.has(username) && !force) {
      throw new ConflictException(API_MESSAGES.AUTH.ALREADY_LOGGED_ID);
    }

    const sessionId = randomBytes(16).toString('hex');
    this.activeSessions.set(username, { sessionId, clientSignature });

    return {
      message: API_MESSAGES.AUTH.SUCCEED_LOGIN,
      username: user.username,
      sessionId,
    };
  }

  /**
   * @summary 사용자 로그아웃 처리
   * @description 활성 세션 맵에서 해당 사용자의 세션 정보를 삭제.
   * @param username - 로그아웃할 사용자 이름
   * @returns 로그아웃 성공 메시지 객체 반환
   */
  logout(username: string) {
    this.activeSessions.delete(username);
    return { message: API_MESSAGES.AUTH.SUCCEED_LOGOUT };
  }

  /**
   * @summary 세션 유효성 검증
   * @description 제공된 사용자 이름과 세션 ID가 서버에 저장된 값과 일치하는지 확인.
   * @param username - 검증할 사용자 이름
   * @param sessionId - 검증할 세션 ID
   * @param clientSignature - 검증을 요청한 클라이언트의 식별 시그니처
   * @returns 세션 유효성 결과 객체. 실패 시 저장된 클라이언트 시그니처를 포함할 수 있음.
   */
  async getValidateSession(
    username: string,
    sessionId: string,
  ): Promise<{
    isValid: boolean;
    userType?: string;
    username?: string;
    message?: string;
  }> {
    const userSession = this.activeSessions.get(username);

    if (!userSession || userSession.sessionId !== sessionId) {
      return { isValid: false, message: '세션 정보가 유효하지 않습니다.' };
    }

    const user = await this.usersService.getUserByUsername(username);

    if (!user) {
      // 세션이 있지만 사용자를 찾을 수 없는 경우 (예: DB에서 삭제됨)
      this.activeSessions.delete(username); // 무효한 세션 제거
      return { isValid: false, message: API_MESSAGES.AUTH.INVALID_USERS };
    }

    return {
      isValid: true,
      userType: user.user_type,
      username: user.username,
      message: API_MESSAGES.AUTH.VALID_SESSION,
    };
  }
}
