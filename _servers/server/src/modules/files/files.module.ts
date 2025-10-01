import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { Paths } from '@src_apps/config';
import * as fs from 'fs';
import { diskStorage } from 'multer';
import * as path from 'path';
import { v4 as uuid } from 'uuid';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        storage: diskStorage({
          destination: (req, _file, cb) => {
            const saveFolder = req.query.saveFolder as string;
            const destPath = configService.get<string>(
              saveFolder === 'images' ? Paths.PUBLIC_IMG : Paths.PUBLIC_TEMP,
            ) as string;

            if (!destPath) {
              return cb(new Error('Invalid save folder specified'), '');
            }

            // 업로드 경로가 존재하지 않으면, 폴더를 생성
            if (!fs.existsSync(destPath)) {
              fs.mkdirSync(destPath, { recursive: true });
            }
            cb(null, destPath);
          },
          filename: (_req, file, cb) => {
            const ext = path.extname(file.originalname);
            cb(null, `${uuid()}${ext}`);
          },
        }),
      }),
    }),
  ],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
