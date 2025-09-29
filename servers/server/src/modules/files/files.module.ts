import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { isProduction, publicPaths } from '@src_apps/app.module';
import * as fs from 'fs';
import { diskStorage } from 'multer';
import * as path from 'path';
import { v4 as uuid } from 'uuid';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';

const MULTER_PATH = {
  TEMPORARY: 'temporary',
};
@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          const BASE_PATH = isProduction
            ? publicPaths.PRODUCTION
            : publicPaths.DEVELOP;
          const uploadPath = path.join(BASE_PATH, MULTER_PATH.TEMPORARY);

          // 업로드 경로가 존재하지 않으면, 폴더를 생성
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (_req, file, cb) => {
          const ext = path.extname(file.originalname);
          cb(null, `${uuid()}${ext}`);
        },
      }),
    }),
  ],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
