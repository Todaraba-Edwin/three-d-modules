import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { API_PREFIX, USERS } from '@src_common';
import { UserType, type User } from './user.interface';
import { UsersService } from './users.service';

const { SEGMENTS, PARAMS } = USERS;

@Controller(`${API_PREFIX}/${SEGMENTS.BASE}`)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(`:${PARAMS.USERNAME}`)
  findOne(@Param(PARAMS.USERNAME) userName: string): User {
    return this.usersService.findOne(userName);
  }

  @Get(`${SEGMENTS.TYPE}/:${PARAMS.USERTYPE}`)
  findByUserType(@Param(PARAMS.USERTYPE) userType: UserType): User[] {
    if (!Object.values(UserType).includes(userType)) {
      throw new NotFoundException(`Invalid user type: ${userType}`);
    }
    return this.usersService.findByUserType(userType);
  }
}
