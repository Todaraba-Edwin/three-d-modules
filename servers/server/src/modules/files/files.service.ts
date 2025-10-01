import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MEDIA_SERVE_ROOT } from '@src_apps/common/api';
import * as fs from 'fs';
import * as path from 'path';
// fs # Node.js 내장 모듈 - file  System 파일 읽기, 쓰기, 폴더 생성 모듈
// path # Node.js 내장 모듈 - 파일 및 디렉토리 경로를 다룰 때 사용

@Injectable()
export class FilesService {
  private readonly publicPath: string;

  constructor(private readonly configService: ConfigService) {
    this.publicPath = this.configService.get<string>('paths.public') as string;
  }

  /**
   * @summary 파일을 저장하고, 웹에서 접근 가능한 경로를 반환합니다.
   * @param file - Express.Multer.File
   * @param saveFolder - 'images' 또는 'temporary'
   * @returns {{ url: string }}
   */
  uploadFile(file: Express.Multer.File, saveFolder?: string): { url: string } {
    if (!file) {
      throw new InternalServerErrorException('파일이 업로드되지 않았습니다.');
    }

    const folder = saveFolder === 'images' ? 'images' : 'temporary';
    const webPath = `${folder}/${file.filename}`;
    return { url: `${MEDIA_SERVE_ROOT}/${webPath}` };
  }

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
}
