import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from '@src_modules_users/index';
import { USER_TN_USERS } from './dto';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([USER_TN_USERS])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // UsersService를 다른 모듈에서 사용할 수 있도록 export
})
export class UsersModule {}
