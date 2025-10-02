import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as fs from 'fs/promises';
import * as path from 'path';
import { Paths } from './config';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  constructor(private readonly configService: ConfigService) {}

  getHello(): string {
    return 'Hello World!';
  }

  /**
   * @description 스케줄러 간격 : 6시간 
   * maxAgeMinutes(5분) 간격으로 public.temporary 내의 파일 제거 */ 
  
  @Cron(CronExpression.EVERY_6_HOURS)
  async handleTempFileCleanup(): Promise<void> {
    const tempDir: string =
      this.configService.get<string>(Paths.PUBLIC_TEMP) ?? '';
    const maxAgeMinutes = 5;

    try {
      const allFiles = await fs.readdir(tempDir);
      const visibleFiles = allFiles.filter((file) => !file.startsWith('.'));

      if (visibleFiles.length === 0) {
        return; // 처리할 파일이 없으면 조용히 종료
      }

      this.logger.log(
        `Running temporary file cleanup task for ${visibleFiles.length} file(s)...`,
      );

      for (const file of visibleFiles) {
        const filePath = path.join(tempDir, file);
        try {
          const stats = await fs.stat(filePath);
          const now = new Date();
          const fileAgeMinutes =
            (now.getTime() - stats.mtime.getTime()) / (1000 * 60);

          if (fileAgeMinutes > maxAgeMinutes) {
            await fs.unlink(filePath);
            this.logger.log(`Deleted old temporary file: ${file}`);
          }
        } catch (statError) {
          this.logger.error(`Could not stat file ${filePath}:`, statError);
        }
      }
    } catch (error) {
      if (error.code === 'ENOENT') {
        // tempDir 자체가 없는 경우는 무시 (로그 X)
      } else {
        this.logger.error('Error during temporary file cleanup:', error);
      }
    }
  }
}
