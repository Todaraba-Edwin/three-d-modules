import { IntersectionType } from '@nestjs/mapped-types';
import { ResultDto, SaveFolderOptionDto } from '@src_apps/modules/_api';

// ⬅️ Request // ====================================
export class UploadFileReqBody {
  file: Express.Multer.File;
}

export class uploadFileServiceParameter extends IntersectionType(
  UploadFileReqBody,
  SaveFolderOptionDto,
) {}

// ➡️ Result // ====================================
export class UploadFileResult extends ResultDto {
  url: string;
}
