import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  USER_TC_MENUS,
  USER_TC_ROLES,
  USER_TN_ROLE_MENU_PERMISSIONS,
  USER_TN_USERS,
  USER_TN_USER_ROLES,
} from './entities';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      USER_TN_USERS,
      USER_TC_ROLES,
      USER_TN_USER_ROLES,
      USER_TN_ROLE_MENU_PERMISSIONS,
      USER_TC_MENUS,
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // UsersService를 다른 모듈에서 사용할 수 있도록 export
})
export class UsersModule {}
