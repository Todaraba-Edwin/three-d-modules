import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { API_PREFIX, USERS } from '@src_apps/common/api/index';

import { CreateUserDto, UpsertRoleDto, USER_TN_USERS } from './dto';
import { UsersService } from './users.service';

const { SEGMENTS, PARAMS } = USERS;

@Controller(`${API_PREFIX}/${SEGMENTS.BASE}`)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * @summary POST /api/users - 신규 사용자 생성
   * @param body - 사용자 생성을 위한 DTO
   * @returns 생성된 사용자 정보 (비밀번호 제외)
   */
  @Post()
  async createUser(@Body() body: CreateUserDto): Promise<USER_TN_USERS> {
    return this.usersService.setUser(
      body.username,
      body.password,
      body.nickname,
      body.email,
      body.role_id,
    );
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
        `User with username "${userName}" not found.`,
      );
    }
    return user;
  }
}
