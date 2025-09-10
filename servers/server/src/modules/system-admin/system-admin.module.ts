import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { USER_TN_USERS } from '../users/dto';
import {
  NMS_TC_SWITCH_MODELS,
  NMS_TN_DEVICES,
  NMS_TN_SWITCHES,
} from './dto';
import { SystemAdminController } from './system-admin.controller';
import { SystemAdminService } from './system-admin.service';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      USER_TN_USERS,
      NMS_TC_SWITCH_MODELS,
      NMS_TN_SWITCHES,
      NMS_TN_DEVICES,
    ]),
  ],
  controllers: [SystemAdminController],
  providers: [SystemAdminService],
})
export class SystemAdminModule {}
