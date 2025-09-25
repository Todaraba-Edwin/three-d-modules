import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from '@src_apps/index';
import { AuthModule, BmsModule, FilesModule, UsersModule } from '@src_modules/index';
import { AppService } from 'app.service';
import * as path from 'path';
import { SwitchesModule } from './modules/switches/switches.module';
import { SystemAdminModule } from './modules/system-admin/system-admin.module';
import { MEDIA_SERVE_ROOT } from './common/api';

export const isProduction = process.env.NODE_ENV === 'production';
export const publicPaths = {
  PRODUCTION: path.join(process.cwd(), 'public'),
  DEVELOP: path.resolve(process.cwd(), '../../Dockerfiles/data'),
};

@Module({
  imports: [
    ServeStaticModule.forRoot({
      serveRoot: MEDIA_SERVE_ROOT,
      rootPath: isProduction
        ? publicPaths['PRODUCTION']
        : publicPaths['DEVELOP'],
    }),
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
