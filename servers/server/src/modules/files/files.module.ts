import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { v4 as uuid } from 'uuid';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { isProduction, publicPaths } from '@src_apps/app.module';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: (req, file, cb) => {
          const basePath = isProduction
            ? publicPaths.PRODUCTION
            : publicPaths.DEVELOP;
          const uploadPath = path.join(basePath, 'temporary');

          // Ensure the upload path exists
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
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
