import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from '@src_apps/index';
import { AuthModule, BmsModule, FilesModule, UsersModule } from '@src_modules/index';
import { AppService } from 'app.service';
import { SwitchesModule } from './modules/switches/switches.module';
import { SystemAdminModule } from './modules/system-admin/system-admin.module';
import { MEDIA_SERVE_ROOT } from './common/api';
import pathsConfig from './config/paths.config';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [pathsConfig],
    }),
    ServeStaticModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          serveRoot: MEDIA_SERVE_ROOT,
          rootPath: configService.get('paths.public'),
        },
      ],
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
    FilesModule,
    BmsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor() {
    console.info('🔧 DB_HOST:', process.env.DB_HOST);
  }
}
