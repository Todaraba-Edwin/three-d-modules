import {
  Controller,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as API from '@src_apps/modules/_api';
import { UploadFileReqBody, UploadFileResult } from './dto/files.dto';
import { FilesService } from './files.service';

@Controller(`${API.API_PREFIX}/${API.FILES.SEGMENTS.BASE}`)
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  /**
   * @summary POST /api/files/upload - 파일 1개 업로드
   * @description 쿼리 파라미터 saveFolder=images 를 추가하면 영구 저장소에 저장
   * @param file
   * @param saveFolder
   */
  @Post(API.FILES.SEGMENTS.UPLOAD)
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile() file: UploadFileReqBody['file'],
    @Query() { saveFolder }: API.SaveFolderOptionDto,
  ): UploadFileResult {
    const result = this.filesService.uploadFile({
      file,
      saveFolder,
    });
    return result;
  }
}
/**
 * TODO 
  @Get(API.FILES.SEGMENTS.GET_GIBS)
  listGlbFiles(@Req() req: Request): GetFilesResult {
    const host = req.get('host');
    const protocol = req.protocol;
    const baseUrl = `${protocol}://${host}${API.MEDIA_SERVE_ROOT}`;
    const subfolder = API.FILES.SEGMENTS.GET_GIBS;
    return this.filesService.getFiles({ baseUrl, subfolder });
  }
*/
