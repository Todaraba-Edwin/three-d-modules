import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ImageDir, Paths, publicChildren } from '@src_apps/config';
import { API_MESSAGES, MEDIA_SERVE_ROOT } from '@src_apps/modules/_api';
import * as fs from 'fs';
import * as path from 'path';
import { ERROR_CODE } from '../_common';
import { UploadFileResult, uploadFileServiceParameter } from './dto/files.dto';
// fs # Node.js 내장 모듈 - file  System 파일 읽기, 쓰기, 폴더 생성 모듈
// path # Node.js 내장 모듈 - 파일 및 디렉토리 경로를 다룰 때 사용

@Injectable()
export class FilesService {
  private readonly publicPath: string;

  constructor(private readonly configService: ConfigService) {
    this.publicPath = this.configService.get<string>(Paths.PUBLIC) ?? '';
  }

  /**
   * @summary 파일을 저장하고, 웹에서 접근 가능한 경로를 반환합니다.
   * @param file - Express.Multer.File
   * @param saveFolder - PublicChildrenEnums
   * @returns {UploadFileResult}
   */
  uploadFile({
    file,
    saveFolder,
  }: uploadFileServiceParameter): UploadFileResult {
    if (!file) {
      throw new InternalServerErrorException(API_MESSAGES.FILES.NOT_SAVE_FILE);
    }

    const folder =
      saveFolder === publicChildren.IMAGES
        ? publicChildren.IMAGES
        : publicChildren.TEMPORARY;
    const webPath = `${folder}/${file.filename}`;
    return {
      message: API_MESSAGES.FILES.SAVE_FILE,
      url: `${MEDIA_SERVE_ROOT}/${webPath}`,
    };
  }

  /**
   * @summary 임시 파일에서 -> target fileUrl 폴더로 이주시킵니다.
   * @param file - Express.Multer.File
   * @param saveFolder - PublicChildrenEnums
   * @returns {UploadFileResult}
   */

  async moveFiles({
    fileUrl,
    target,
  }: {
    fileUrl: string;
    target: 'Building image';
  }): Promise<UploadFileResult> {
    const fileName = path.basename(fileUrl);
    const sourcePath = path.join(
      this.configService.get<string>(Paths.PUBLIC_TEMP) as string,
      fileName,
    );
    const destDir = this.configService.get<string>(Paths.PUBLIC_IMG) as string;
    const destPath = path.join(destDir, fileName);

    try {
      await fs.promises.mkdir(destDir, { recursive: true });
      await fs.promises.rename(sourcePath, destPath);
      return {
        message: API_MESSAGES.FILES.MOVE_FILE,
        url: `${ImageDir.IMAGE}/${fileName}`,
      };
    } catch (error) {
      if (error.code === ERROR_CODE.FS_ERROR.NO_ENTRY.CODE) {
        throw new NotFoundException(
          ERROR_CODE.FS_ERROR.NO_ENTRY.MESSAGE({ sourcePath }),
        );
      } else {
        throw new InternalServerErrorException(
          ERROR_CODE.FS_ERROR.OTHER_CASE_MESSAGE({
            target,
          }),
        );
      }
    }
  }
}

/*
  * @summary TODO - GIB 객체에 대해서 
type GetFilesParameterType = Record<'subfolder' | 'baseUrl', string>;
  getFiles({ baseUrl, subfolder }: GetFilesParameterType): GetFilesResult {
    const directoryPath = path.join(this.publicPath, subfolder);
    const isExists = fs.existsSync(directoryPath);

    // 1. fs.existsSync(): 파일 또는 디렉토리가 지정된 경로에 실제로 존재하는지 확인합니다.
    // 존재하지 않으면, 에러를 발생시키는 대신 빈 배열을 반환하여 안전하게 처리합니다.
    if (!isExists) return [];

    // 2. fs.readdirSync(): 지정된 디렉토리 경로의 모든 파일 및 하위 디렉토리 이름을 배열로 읽어옵니다.
    // 'Sync'는 동기적(synchronous)으로 동작함을 의미하며, 작업이 끝날 때까지 다음 코드로 넘어가지 않습니다.
    try {
      const files = fs.readdirSync(directoryPath);
      return files.map((file) => ({
        fileName: file,
        url: `${baseUrl}/${subfolder}/${file}`,
      }));
      // eslint-disable-next-line
    } catch (error) {
      throw new Error(`Failed to read directory: ${subfolder}`);
    }
  }
*/
