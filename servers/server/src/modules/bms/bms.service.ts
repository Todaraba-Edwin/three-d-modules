import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { Building } from './dto';

@Injectable()
export class BmsService {
  constructor(
    @InjectRepository(Building)
    private readonly buildingRepository: Repository<Building>,
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

    // search이 있으면 이름(buildingName)과 주소(address)에서 모두 검색 (OR 조건)
    const where: FindOptionsWhere<Building>[] = [
      { buildingName: Like(`%${search}%`) },
      { address: Like(`%${search}%`) },
    ];

    const result = await this.buildingRepository.find({ where });

    return result;
  }
}
