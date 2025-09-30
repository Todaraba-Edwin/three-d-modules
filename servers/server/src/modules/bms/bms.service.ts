import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { API_MESSAGES } from '@src_common/api';
import * as fs from 'fs/promises';
import * as path from 'path';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { Building, CreateBuildingDto } from './dto';

@Injectable()
export class BmsService {
  constructor(
    @InjectRepository(Building)
    private readonly buildingRepository: Repository<Building>,
    private readonly configService: ConfigService,
  ) {}

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
   * @returns {Promise<void>} 등
   */
  async deleteBuilding(id: number): Promise<void> {
    try {
      await this.buildingRepository.delete(id);
    } catch (error) {
      if (error.code === 'ER_ROW_IS_REFERENCED_2') {
        throw new ConflictException(API_MESSAGES.BUILDING.CANNOT_DELETE_HAS_FLOORS);
      }
      throw error;
    }
  }
}
