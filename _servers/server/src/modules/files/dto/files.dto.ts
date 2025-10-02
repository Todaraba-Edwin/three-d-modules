import { IntersectionType } from '@nestjs/mapped-types';
import { ResultDto, SaveFolderOptionDto } from '@src_apps/modules/_api';
import { IsNotEmpty, IsObject, IsUrl } from 'class-validator';

// ⬅️ Request // ====================================
export class UploadFileReqBody {
  @IsObject()
  @IsNotEmpty()
  file: Express.Multer.File;
}

export class uploadFileServiceParameter extends IntersectionType(
  UploadFileReqBody,
  SaveFolderOptionDto,
) {}

// ➡️ Result // ====================================
export class UploadFileResult extends ResultDto {
  @IsUrl()
  @IsNotEmpty()
  url: string;
}
