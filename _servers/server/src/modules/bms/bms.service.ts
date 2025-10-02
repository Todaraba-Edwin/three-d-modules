import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as Config from '@src_apps/config';
import { API_MESSAGES, ResultDto } from '@src_apps/modules/_api';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { ERROR_CODE } from '../_common';
import { FilesService } from '../files/files.service';
import * as Dto from './dto';
import * as Entities from './entities';

@Injectable()
export class BmsService {
  constructor(
    @InjectRepository(Entities.Building)
    private readonly buildingRepository: Repository<Entities.Building>,
    private readonly filesService: FilesService,
  ) {}

  /**
   * @summary 건물 간단 조회
   * @description 검색어로 건물 이름 또는 주소를 검색합니다. 검색어가 없으면 모든 건물 목록을 반환합니다.
   * @param search 건물 이름 또는 주소 (부분 일치 검색)
   * @returns {Promise<GetBuildingList[]>} 건물 목록
   */
  async getBuildingsBrief(search?: string): Promise<Dto.GetBuildingList[]> {
    const selectOptions = {
      id: true,
      buildingName: true,
      address: true,
    };

    const where: FindOptionsWhere<Entities.Building>[] | undefined = search
      ? [
          { buildingName: Like(`%${search}%`) },
          { address: Like(`%${search}%`) },
        ]
      : undefined;

    return this.buildingRepository.find({
      select: selectOptions,
      ...(where && { where }),
    });
  }

  /**
   * @summary 건물명 기반 건물검색
   * @description 해당 건물명으로 등록된 건물의 존재여부를 파악합니다.
   * @param buildingName 검색할 건물 이름
   * @returns {Promise<ResultDto>} 건물명 사용가능 메시지
   */
  async existsByName(buildingName: string): Promise<ResultDto> {
    const { BUILDING } = API_MESSAGES;
    const existingBuilding = await this.buildingRepository.findOne({
      where: { buildingName },
    });

    const isExist = !!existingBuilding;

    if (isExist) {
      throw new ConflictException(BUILDING.EXIST_BUILDING_NAME);
    }

    return {
      message: BUILDING.VALID_BUILDING_NAME,
    };
  }

  /**
   * @summary 건물 상세 조회 + Floor[]
   * @description 선택된 건물의 맴핑테이블(Floor)와 함께 전달합니다.
   * @param id 조회할 건물의 ID
   * @returns {Promise<Entities.Building>} 조회된 건물의 상세 데이터
   */
  async getBuildingDetail(id: number): Promise<Entities.Building> {
    const building = await this.buildingRepository.findOne({
      where: { id },
      relations: { floors: true },
    });

    if (!building) {
      const { BUILDING } = API_MESSAGES;
      throw new NotFoundException(BUILDING.NOT_FOUND_BUILDING({ id }));
    }

    return building;
  }

  /**
   * @summary 건물 생성
   * @description 새로운 건물을 생성합니다.
   * @param buildingData 생성할 건물 데이터
   * @returns {Promise<ResultDto>} 생성된 건물 데이터
   */
  async createBuilding(
    buildingData: Dto.CreateBuildingReqBody,
  ): Promise<Dto.CreateBuildingResult> {
    await this.existsByName(buildingData.buildingName);

    if (
      buildingData.buildingImageUrl &&
      buildingData.buildingImageUrl.includes(Config.ImageDir.TEMPORARY)
    ) {
      const result = await this.filesService.moveFiles({
        fileUrl: buildingData.buildingImageUrl,
        target: 'Building image',
      });
      buildingData.buildingImageUrl = result.url;
    }

    const newBuilding = this.buildingRepository.create(buildingData);
    const result = await this.buildingRepository.save(newBuilding);

    return {
      message: API_MESSAGES.BUILDING.CREATE_BUILDING,
      createdBuildingId: Number(result.id),
    };
  }

  /**
   * @summary 건물 삭제
   * @description 주어진 ID에 해당하는 건물을 삭제합니다.
   * @param id 삭제할 건물의 ID
   * @returns {Promise<Dto.DeleteBuildingResult>} 등
   */
  async deleteBuilding(id: number): Promise<Dto.DeleteBuildingResult> {
    try {
      await this.buildingRepository.delete(id);
    } catch (error) {
      if (error.code === ERROR_CODE.SQL_ERROR.IS_REFERENCED.CODE) {
        throw new ConflictException(
          ERROR_CODE.SQL_ERROR.IS_REFERENCED.MESSAGE({ id }),
        );
      }
      throw error;
    }

    return {
      message: API_MESSAGES.BUILDING.DELETED_BUILDING,
      deleteBuildingId: id,
    };
  }
}
