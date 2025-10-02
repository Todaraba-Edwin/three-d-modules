import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { API_MESSAGES, ResultDto } from '@src_apps/modules/_api';
import { compare } from 'bcrypt';
import { randomBytes } from 'crypto';
import { UsersService } from '../users/users.service';
import * as Dto from './dto';

@Injectable()
export class AuthService {
  private activeSessions = new Map<
    string,
    { username: string; clientSignature: string }
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
   * @returns 로그인 성공 시, 성공 메시지, 세션 ID 객체 반환
   *
   * @throws {UnauthorizedException} 사용자 정보 불일치 시 (HTTP 401)
   * @throws {ConflictException} 이미 로그인 상태(force=false)일 시 (HTTP 409)
   */

  async login({
    username,
    password,
    force = false,
    clientSignature,
  }: Dto.LoginServiceParams): Promise<Dto.LoginResDto> {
    const user = await this.usersService.getUserByUsername(username);
    const { INVALID_USERS, INVALID_PASSWORD } = API_MESSAGES.AUTH;

    if (!user) {
      throw new UnauthorizedException(INVALID_USERS);
    }

    const isPasswordMatching = await compare(password, user.password);

    if (!isPasswordMatching) {
      throw new UnauthorizedException(INVALID_PASSWORD);
    }

    // username으로 기존 세션 검색
    let existingSessionId: string | null = null;
    for (const [sessionId, sessionData] of this.activeSessions.entries()) {
      if (sessionData.username === username) {
        existingSessionId = sessionId;
        break;
      }
    }

    // 기존 세션 처리
    if (existingSessionId) {
      if (!force) {
        throw new ConflictException(API_MESSAGES.AUTH.ALREADY_LOGGED_ID);
      }
      // 강제 로그인 시 기존 세션 삭제
      this.activeSessions.delete(existingSessionId);
    }

    const sessionId = randomBytes(16).toString('hex');
    this.activeSessions.set(sessionId, { username, clientSignature });

    // 로그인 성공 시, 마지막 로그인 시간 업데이트
    await this.usersService.updateLastLogin(user.id);

    return {
      result: { message: API_MESSAGES.AUTH.SUCCEED_LOGIN },
      sessionId,
    };
  }

  /**
   * @summary 사용자 로그아웃 처리
   * @description 활성 세션 맵에서 해당 사용자의 세션 정보를 삭제.
   * @param sessionId - 로그아웃할 세션 ID
   * @returns 로그아웃 성공 메시지 객체 반환
   */
  logout(sessionId: string | undefined): ResultDto {
    if (sessionId) {
      this.activeSessions.delete(sessionId);
    }

    return { message: API_MESSAGES.AUTH.SUCCEED_LOGOUT };
  }

  /**
   * @summary 세션 유효성 검증
   * @description 제공된 세션 ID가 서버에 저장된 값과 일치하는지 확인.
   * @param sessionId - 검증할 세션 ID
   * @returns 세션 유효성 결과 객체.
   */
  async getValidateSession(
    sessionId: string,
  ): Promise<Dto.SessionValidationInternalResult> {
    const sessionData = this.activeSessions.get(sessionId);
    const { NOT_FOUND_SESSION_SERVER, INVALID_USERS, VALID_SESSION } =
      API_MESSAGES.AUTH;

    if (!sessionData) {
      return {
        isValid: false,
        message: NOT_FOUND_SESSION_SERVER,
      };
    }

    const user = await this.usersService.getUserByUsername(
      sessionData.username,
    );

    if (!user) {
      // 세션이 있지만 사용자를 찾을 수 없는 경우
      this.activeSessions.delete(sessionId); // 무효한 세션 제거
      return { isValid: false, message: INVALID_USERS };
    }

    const { role_id, nickname } = user;

    const { role_code: roleCode } =
      (await this.usersService.getRoleCodeByRoleId(role_id)) ?? {
        role_code: null,
      };

    if (!roleCode) {
      // 세션이 있지만 권한코드를 찾을 수 없는 경우
      this.activeSessions.delete(sessionId); // 무효한 세션 제거
      return { isValid: false, message: INVALID_USERS };
    }

    const permissions = (
      await this.usersService.getMenuPermissionByRoleId(role_id)
    ).map((p) => ({ ...p, parent_id: p.parent_id || null }));

    return {
      isValid: true,
      message: VALID_SESSION,
      // 추가 객체
      roleCode,
      nickname,
      permissions,
    };
  }
}
