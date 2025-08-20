import { Injectable, NotFoundException } from '@nestjs/common';
import { User, UserType } from './user.interface';

@Injectable()
export class UsersService {
  private readonly users: User[] = [
    { userName: 'admin', userType: UserType.ADMIN_MAIN },
    { userName: 'admin2', userType: UserType.ADMIN_MAIN },
    { userName: 'admin-sub', userType: UserType.ADMIN_SUB },
    // { userName: 'user', userType: UserType.USER },
  ];

  findOne(userName: string): User {
    const user = this.users.find((user) => user.userName === userName);
    if (!user) {
      throw new NotFoundException(`User with name "${userName}" not found.`);
    }
    return user;
  }

  // New method to find users by type
  findByUserType(userType: UserType): User[] {
    const foundUsers = this.users.filter((user) => user.userType === userType);
    return foundUsers;
  }
}
