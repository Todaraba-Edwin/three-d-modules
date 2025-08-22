import { Controller, Get, NotFoundException, Param, Post, Body } from '@nestjs/common';
import { API_PREFIX, USERS } from '@src_common/index';
import { UserType, type User } from './user.entity'; // user.interface 대신 user.entity 임포트
import { UsersService } from './users.service';

// DTO (Data Transfer Object) for creating a user
class CreateUserDto {
  username: string;
  password: string;
  email: string;
  user_type: UserType;
}

const { SEGMENTS, PARAMS } = USERS;

@Controller(`${API_PREFIX}/${SEGMENTS.BASE}`)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() body: CreateUserDto): Promise<User> {
    return this.usersService.createUser(body.username, body.password, body.email, body.user_type);
  }

  @Get(`:${PARAMS.USERNAME}`)
  async findOne(@Param(PARAMS.USERNAME) userName: string): Promise<User> {
    const user = await this.usersService.findOneByUsername(userName);
    if (!user) {
      throw new NotFoundException(`User with username "${userName}" not found.`);
    }
    return user;
  }

  @Get(`${SEGMENTS.TYPE}/:${PARAMS.USERTYPE}`)
  findByUserType(@Param(PARAMS.USERTYPE) userType: UserType): Promise<User[]> {
    if (!Object.values(UserType).includes(userType)) {
      throw new NotFoundException(`Invalid user type: ${userType}`);
    }
    return this.usersService.findByUserType(userType);
  }
}
