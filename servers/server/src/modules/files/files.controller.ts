import {
  Controller,
  Get,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as API from '@src_apps/common/api';
import type { Request } from 'express';
import { FilesService } from './files.service';

@Controller(`${API.API_PREFIX}/${API.FILES.SEGMENTS.BASE}`)
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get(API.FILES.SEGMENTS.GET_GIBS)
  listGlbFiles(@Req() req: Request): GetFilesResult {
    const host = req.get('host');
    const protocol = req.protocol;
    const baseUrl = `${protocol}://${host}${API.MEDIA_SERVE_ROOT}`;
    const subfolder = API.FILES.SEGMENTS.GET_GIBS;
    return this.filesService.getFiles({ baseUrl, subfolder });
  }

  /**
   * @summary POST /api/files/upload-temporary - 임시 파일 1개 업로드
   * @param file
   */
  @Post(API.FILES.SEGMENTS.UPLOAD_TEMPORARY)
  @UseInterceptors(FileInterceptor('file'))
  setTemporaryFile(@UploadedFile() file: Express.Multer.File): {
    tempUrl: string;
  } {
    return this.filesService.setTemporaryFile(file);
  }
}
