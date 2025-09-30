import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { Building, CreateBuildingDto } from './dto';

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
    // const existingBuilding = await this.buildingRepository.findOne({
    //   where: { buildingName: buildingData.buildingName },
    // });

    // if (existingBuilding) {
    //   throw new ConflictException('해당 건물명이 이미 존재합니다.');
    //   return;
    // }

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
