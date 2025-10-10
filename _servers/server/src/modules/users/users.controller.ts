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
import { API_PREFIX, ResultDto, USERS } from '@src_apps/modules/_api/index';
import * as Dto from './dto';
import * as Entities from './entities';
import { UsersService } from './users.service';

const { SEGMENTS, PARAMS } = USERS;

@Controller(`${API_PREFIX}/${SEGMENTS.BASE}`)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAllUsers(
    @Query('role_id') roleId?: string,
  ): Promise<Dto.FindAllUsersResultDto> {
    const roleIdNum = roleId ? parseInt(roleId, 10) : undefined;
    return this.usersService.getAllUsersWithRoles(roleIdNum);
  }

  @Delete()
  async deleteUsers(
    @Body() body: Dto.DeleteUsersReqDto,
  ): Promise<Dto.DeleteUsersResultDto> {
    return this.usersService.deleteUsers(body.userIds);
  }

  @Post()
  async createUser(
    @Body() body: Dto.CreateUserReqDto,
  ): Promise<Dto.CreateUserResultDto> {
    return this.usersService.createUser(body);
  }

  @Post('update')
  async updataUser(
    @Body() body: Dto.UpdateUserReqDto,
  ): Promise<Dto.UpdateUserResultDto> {
    return this.usersService.updateUser(body);
  }

  @Post('check-username')
  @HttpCode(HttpStatus.OK)
  async checkUsername(
    @Body() body: Dto.CheckUsernameReqDto,
  ): Promise<ResultDto> {
    return this.usersService.checkUsername(body.username);
  }

  @Post('check-email')
  @HttpCode(HttpStatus.OK)
  async checkEmail(@Body() body: Dto.CheckEmailReqDto): Promise<ResultDto> {
    return this.usersService.checkEmail(body.email);
  }

  @Post('role')
  async upsertRole(
    @Body() body: Dto.UpsertRoleReqDto,
  ): Promise<Dto.UpsertRoleResultDto> {
    return this.usersService.upsertRoleWithPermissions(body);
  }

  @Get(`:${PARAMS.USERNAME}`)
  async findOne(
    @Param(PARAMS.USERNAME) userName: string,
  ): Promise<Entities.USER_TN_USERS> {
    const user = await this.usersService.getUserByUsername(userName);
    if (!user) {
      throw new NotFoundException(`"${userName}"을 찾을 수 없습니다.`);
    }
    return user;
  }
}
