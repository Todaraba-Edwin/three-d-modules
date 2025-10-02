import { Module } from '@nestjs/common';
import { ImageMulter } from './_multer.modules';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';

@Module({
  imports: [ImageMulter],
  controllers: [FilesController],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
