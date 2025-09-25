import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthAdminGuard, AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard, AuthAdminGuard],
  exports: [AuthService, AuthGuard, AuthAdminGuard],
})
export class AuthModule {}
