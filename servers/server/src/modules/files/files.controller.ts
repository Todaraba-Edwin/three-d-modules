import { Controller, Get, Req } from '@nestjs/common';
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
}
