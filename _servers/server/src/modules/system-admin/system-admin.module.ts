import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
// import { USER_TC_ROLES, USER_TN_USERS } from '../users/dto';
import {
  NMS_TC_MANUFACTURERS,
  NMS_TC_SWITCH_MODELS,
  NMS_TN_DEVICES,
  NMS_TN_SWITCHES,
} from './entities';
import { SystemAdminController } from './system-admin.controller';
import { SystemAdminService } from './system-admin.service';
import { USER_TC_ROLES, USER_TN_USERS } from '../users/entities';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      USER_TN_USERS,
      USER_TC_ROLES,
      NMS_TC_SWITCH_MODELS,
      NMS_TN_SWITCHES,
      NMS_TN_DEVICES,
      NMS_TC_MANUFACTURERS,
    ]),
  ],
  controllers: [SystemAdminController],
  providers: [SystemAdminService],
})
export class SystemAdminModule {}
