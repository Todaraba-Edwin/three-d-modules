import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import * as API from '@src_apps/common/api';
import { AuthAdminGuard } from '../auth/auth.guard';
import { BmsService } from './bms.service';
import { Building, CreateBuildingDto } from './dto';

@Controller(`${API.API_PREFIX}/${API.BMS.SEGMENTS.BASE}`)
@UseGuards(AuthAdminGuard)
export class BmsController {
  constructor(private readonly bmsService: BmsService) {}

  /**
   * @summary GET /api/bms/buildings - 건물 목록 조회
   * @description 건물 목록을 조회합니다. 검색어(search)를 통해 건물 이름 또는 주소로 필터링할 수 있습니다.
   * @param search 건물 이름 또는 주소로 검색하기 위한 검색어
   */
  @Get(API.BMS.SEGMENTS.BUILDINGS)
  getBuildings(
    @Query(API.BMS.PARAMS.SEARCH) search?: string,
  ): Promise<Building[]> {
    return this.bmsService.getBuildings(search);
  }

  /**
   * @summary GEP / api/bms/check-building-name - 등록된 건물명 확인
   * @description 등록된 건물명을 검색합니다.
   * @param search 건물 이름을 검색하기 위한 검색어
   */
  @Get(API.BMS.SEGMENTS.BUILDING_CHECK)
  async checkBuildingsName(
    @Query(API.BMS.PARAMS.SEARCH) search: string,
  ): Promise<{ message: string }> {
    const findBuildingName =
      await this.bmsService.checkBuildingNameExists(search);

    if (findBuildingName) {
      throw new ConflictException(
        API.API_MESSAGES.BUILDING.EXIST_BUILDING_NAME,
      );
    }
    return {
      message: API.API_MESSAGES.BUILDING.VALID_BUILDING_NAME,
    };
  }

  /**
   * @summary POST /api/bms/buildings - 건물 생성
   * @description 새로운 건물을 생성합니다.
   * @param body - 건물 생성을 위한 DTO
   * @returns 생성 성공 메시지
   */

  @Post(API.BMS.SEGMENTS.BUILDINGS)
  async getCreateBuildings(
    @Body() body: CreateBuildingDto,
  ): Promise<{ message: string; createdBuildingId: number }> {
    const findBuildingName = await this.bmsService.checkBuildingNameExists(
      body.buildingName,
    );

    if (findBuildingName) {
      throw new ConflictException(
        API.API_MESSAGES.BUILDING.EXIST_BUILDING_NAME,
      );
    }
    const result = await this.bmsService.createBuilding(body);
    return {
      message: API.API_MESSAGES.BUILDING.CREATE_BUILDING,
      createdBuildingId: Number(result.id),
    };
  }

  @Delete(API.BMS.SEGMENTS.BUILDINGS)
  async deleteBuildings(
    @Body() body: { buildingId: number },
  ): Promise<{ message: string }> {
    await this.bmsService.deleteBuilding(body.buildingId);
    return { message: '건물 삭제 완료' };
  }
}
