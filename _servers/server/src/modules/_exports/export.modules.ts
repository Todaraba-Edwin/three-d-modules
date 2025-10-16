import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Paths, pathsConfig } from '@src_apps/config';
import {
  MEDIA_SERVE_ROOT,
  TILE_MAP_SERVE_ROOT,
} from '@src_apps/modules/_api';

export const ExportModules = [
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
        rootPath: configService.get(Paths.PUBLIC),
      },
      {
        serveRoot: TILE_MAP_SERVE_ROOT,
        rootPath: configService.get(Paths.TILE_MAPS),
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
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: false,
    // synchronize: true is not recommended for production
  }),
];
