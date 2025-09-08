import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { API_PREFIX, USERS } from '@src_apps/common/api/index';

import { CreateUserDto, User, UserType } from './dto';
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
  async createUser(@Body() body: CreateUserDto): Promise<User> {
    return this.usersService.setUser(
      body.username,
      body.password,
      body.nickname,
      body.email,
      body.user_type,
    );
  }

  /**
   * @summary GET /api/users/:userName - 특정 사용자 조회
   * @param userName - 조회할 사용자 이름
   * @returns 특정 사용자 정보
   * @throws {NotFoundException} 사용자를 찾지 못했을 경우
   */
  @Get(`:${PARAMS.USERNAME}`)
  async findOne(@Param(PARAMS.USERNAME) userName: string): Promise<User> {
    const user = await this.usersService.getUserByUsername(userName);
    if (!user) {
      throw new NotFoundException(
        `User with username "${userName}" not found.`,
      );
    }
    return user;
  }

  /**
   * @summary GET /api/users/type/:userType - 특정 유형의 사용자 목록 조회
   * @param userType - 조회할 사용자 유형
   * @returns 특정 유형의 사용자 목록
   * @throws {NotFoundException} 유효하지 않은 사용자 유형일 경우
   */
  @Get(`${SEGMENTS.TYPE}/:${PARAMS.USERTYPE}`)
  findByUserType(@Param(PARAMS.USERTYPE) userType: UserType): Promise<User[]> {
    if (!Object.values(UserType).includes(userType)) {
      throw new NotFoundException(`Invalid user type: ${userType}`);
    }
    return this.usersService.getUsersByUserType(userType);
  }
}
