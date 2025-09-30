import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs/promises';
import * as path from 'path';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { Building, CreateBuildingDto } from './dto';

@Injectable()
export class BmsService {
  private readonly logger = new Logger(BmsService.name);

  constructor(
    @InjectRepository(Building)
    private readonly buildingRepository: Repository<Building>,
    private readonly configService: ConfigService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleTempFileCleanup(): Promise<void> {
    this.logger.log('Running temporary file cleanup task...');
    const tempDir = this.configService.get<string>('paths.temporary') as string;
    const maxAgeMinutes = 5;

    try {
      const files = await fs.readdir(tempDir);
      for (const file of files) {
        if (file.startsWith('.')) continue;

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
        this.logger.warn(
          `Temporary directory not found at ${tempDir}, skipping cleanup.`,
        );
      } else {
        this.logger.error('Error during temporary file cleanup:', error);
      }
    }
  }

  /**
   * @summary 건물 목록 조회
   * @description 검색어로 건물 이름 또는 주소를 검색합니다. 검색어가 없으면 모든 건물 목록을 반환합니다.
   * @param searchTerm 건물 이름 또는 주소 (부분 일치 검색)
   * @returns {Promise<Building[]>} 건물 목록
   */
  async getBuildings(search?: string): Promise<Building[]> {
    if (!search) {
      const result = await this.buildingRepository.find();
      return result;
    }

    const where: FindOptionsWhere<Building>[] = [
      { buildingName: Like(`%${search}%`) },
      { address: Like(`%${search}%`) },
    ];

    const result = await this.buildingRepository.find({ where });
    console.log('result', result);

    return result;
  }

  /**
   * @summary 건물 생성
   * @description 새로운 건물을 생성합니다.
   * @param buildingData 생성할 건물 데이터
   * @returns {Promise<Building>} 생성된 건물 데이터
   */

  async checkBuildingNameExists(buildingName: string): Promise<boolean> {
    const existingBuilding = await this.buildingRepository.findOne({
      where: { buildingName },
    });
    return !!existingBuilding;
  }

  async createBuilding(buildingData: CreateBuildingDto): Promise<Building> {
    if (
      buildingData.buildingImage &&
      buildingData.buildingImage.includes('/media/temporary/')
    ) {
      const fileName = path.basename(buildingData.buildingImage);
      const sourcePath = path.join(
        this.configService.get<string>('paths.temporary') as string,
        fileName,
      );
      const destDir = this.configService.get<string>('paths.images') as string;
      const destPath = path.join(destDir, fileName);

      try {
        await fs.mkdir(destDir, { recursive: true });
        await fs.rename(sourcePath, destPath);
        buildingData.buildingImage = `/media/images/${fileName}`;
      } catch (error) {
        if (error.code === 'ENOENT') {
          throw new NotFoundException(
            `Temporary image file not found at ${sourcePath}`,
          );
        } else {
          throw new InternalServerErrorException(
            'Error processing building image',
          );
        }
      }
    }

    const newBuilding = this.buildingRepository.create(buildingData);
    return this.buildingRepository.save(newBuilding);
  }

  /**
   * @summary 건물 삭제
   * @description 주어진 ID에 해당하는 건물을 삭제합니다.
   * @param id 삭제할 건물의 ID
   * @returns {Promise<void>}
   */
  async deleteBuilding(id: number): Promise<void> {
    await this.buildingRepository.delete(id);
  }
}
