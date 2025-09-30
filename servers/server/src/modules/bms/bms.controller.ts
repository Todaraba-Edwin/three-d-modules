import {
  Body,
  ConflictException,
  Controller,
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
   * @description 건물 목록을 조회합니다. 검색어(q)를 통해 건물 이름 또는 주소로 필터링할 수 있습니다.
   * @param search 건물 이름 또는 주소로 검색하기 위한 검색어
   */
  @Get(API.BMS.SEGMENTS.BUILDINGS)
  getBuildings(
    @Query(API.BMS.PARAMS.SEARCH) search?: string,
  ): Promise<Building[]> {
    return this.bmsService.getBuildings(search);
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
  ): Promise<{ message: string }> {
    const findBuildingName = await this.bmsService.checkBuildingNameExists(
      body.buildingName,
    );

    if (findBuildingName) {
      throw new ConflictException(
        API.API_MESSAGES.BUILDING.EXIST_BUILDING_NAME,
      );
    }
    this.bmsService.createBuilding(body);
    return { message: API.API_MESSAGES.BUILDING.CREATE_BUILDING };
  }
}
