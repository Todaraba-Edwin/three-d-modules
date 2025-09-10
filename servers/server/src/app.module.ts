import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from '@src_apps/index';
import { AuthModule, UsersModule } from '@src_modules/index';
import { AppService } from 'app.service';
import { SwitchesModule } from './modules/switches/switches.module';
import { SystemAdminModule } from './modules/system-admin/system-admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: process.env.DB_HOST || 'localhost',
      port: 3306,
      username: 'root',
      password: 'prizm',
      database: 'prizm',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false, // synchronize: true is not recommended for production
    }),
    UsersModule,
    AuthModule,
    SwitchesModule,
    SystemAdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor() {
    console.info('🔧 DB_HOST:', process.env.DB_HOST);
  }
}
