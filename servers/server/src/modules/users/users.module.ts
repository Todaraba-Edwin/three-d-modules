import { Module } from '@nestjs/common';
import { UsersController } from '@src_modules_users/index';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
