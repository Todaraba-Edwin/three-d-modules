import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { API_PREFIX, USERS } from '@src_apps/common/api/index';

import { CreateUserDto, UpsertRoleDto, USER_TN_USERS } from './dto';
import { UsersService } from './users.service';

const { SEGMENTS, PARAMS } = USERS;

@Controller(`${API_PREFIX}/${SEGMENTS.BASE}`)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * @summary GET /api/users - 모든 또는 특정 역할의 사용자 목록 조회
   * @param roleId - (선택) 특정 역할 ID로 사용자 필터링
   * @returns 사용자 정보 목록 (역할 포함)
   */
  @Get()
  async findAllUsers(@Query('role_id') roleId?: string) {
    const roleIdNum = roleId ? parseInt(roleId, 10) : undefined;
    return this.usersService.getAllUsersWithRoles(roleIdNum);
  }

  /**
   * @summary 사용자 삭제
   * @description 주어진 ID 배열에 해당하는 사용자들을 삭제합니다.
   * @param userIds - 삭제할 사용자 ID들의 배열
   * @returns 삭제 결과
   */
  @Delete()
  async deleteUsers(@Body('userIds') userIds: number[]) {
    return this.usersService.deleteUsers(userIds);
  }

  /**
   * @summary POST /api/users - 신규 사용자 생성
   * @param body - 사용자 생성을 위한 DTO
   * @returns 생성된 사용자 정보 (비밀번호 제외)
   */
  @Post()
  async createUser(@Body() body: CreateUserDto) {
    return this.usersService.createUser(body);
  }

  /**
   * @summary POST /api/users/check-username - 유효성검사 - 사용자명
   * @param body - 사용자 생성을 위한 DTO, 기 사용자명 확인
   * @returns 생성가능 여부, 200 | 409
   */
  @Post('check-username')
  @HttpCode(HttpStatus.OK)
  async checkUsername(@Body() body: { username: string }) {
    await this.usersService.checkUsername(body.username);
    return { message: 'Username is available' };
  }

  /**
   * @summary POST /api/users/check-email - 유효성검사 - 이메일
   * @param body - 이메일 중복 확인
   * @returns 생성가능 여부, 200 | 409
   */
  @Post('check-email')
  @HttpCode(HttpStatus.OK)
  async checkEmail(@Body() body: { email: string }) {
    await this.usersService.checkEmail(body.email);
    return { message: 'Email is available' };
  }

  /**
   * @summary POST /api/users/role - 역할 및 메뉴 권한 생성 또는 업데이트
   * @param body - 역할 및 권한 수정을 위한 DTO
   * @returns 생성 또는 업데이트된 역할 정보
   */
  @Post('role')
  async upsertRole(@Body() body: UpsertRoleDto) {
    return this.usersService.upsertRoleWithPermissions(body);
  }

  /**
   * @summary GET /api/users/:userName - 특정 사용자 조회
   * @param userName - 조회할 사용자 이름
   * @returns 특정 사용자 정보
   * @throws {NotFoundException} 사용자를 찾지 못했을 경우
   */
  @Get(`:${PARAMS.USERNAME}`)
  async findOne(
    @Param(PARAMS.USERNAME) userName: string,
  ): Promise<USER_TN_USERS> {
    const user = await this.usersService.getUserByUsername(userName);
    if (!user) {
      throw new NotFoundException(
        `"${userName}"은 이미 사용 중에 있습니다.`,
      );
    }
    return user;
  }
}
