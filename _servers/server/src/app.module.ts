import { Module } from '@nestjs/common';
import { AppController } from '@src_apps/index';
import * as M from '@src_modules/index';
import { AppService } from 'app.service';

@Module({
  imports: [
    ...M.ExportModules,
    M.UsersModule,
    M.AuthModule,
    M.SwitchesModule,
    M.SystemAdminModule,
    M.FilesModule,
    M.BmsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor() {
    console.info('🔧 DB_HOST:', process.env.DB_HOST);
  }
}
