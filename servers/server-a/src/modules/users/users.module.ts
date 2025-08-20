import { Module } from '@nestjs/common';
import { UsersController, UsersService } from '@src_modules_users';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
