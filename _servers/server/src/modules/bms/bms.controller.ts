import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import * as API from '@src_apps/modules/_api';
import { AuthAdminGuard } from '../auth/auth.guard';
import { BmsService } from './bms.service';
import * as Dto from './dto';
import * as Entities from './entities';

const { SEGMENTS, PARAMS } = API.BMS;

@Controller(SEGMENTS.BASE)
@UseGuards(AuthAdminGuard)
export class BmsController {
  constructor(private readonly bmsService: BmsService) {}

  /**
   * @summary GET /api/bms/buildings - 건물 목록 조회
   * @description 건물 목록을 조회합니다. 검색어(search)를 통해 건물 이름 또는 주소로 필터링할 수 있습니다.
   * @param search 건물 이름 또는 주소로 검색하기 위한 검색어
   */
  @Get(SEGMENTS.BUILDINGS)
  getBuildings(
    @Query() query: API.SearchQueryOptionDto,
  ): Promise<Dto.GetBuildingList[]> {
    const result = this.bmsService.getBuildingsBrief(query[PARAMS.SEARCH]);
    return result;
  }

  /**
   * @summary GEP / api/bms/exists - 등록된 건물명 확인
   * @description 등록된 건물명을 검색합니다.
   * @param search 건물 이름을 검색하기 위한 검색어
   */
  @Get(SEGMENTS.BUILDING_CHECK)
  async checkBuildingExists(
    @Query() query: API.SearchQueryStaticDto,
  ): Promise<API.ResultDto> {
    const result = await this.bmsService.existsByName(query[PARAMS.SEARCH]);
    return result;
  }

  /**
   * @summary GET /api/bms/buildings/:id - 특정 건물 및 하위 층 목록 조회
   * @description 특정 건물 및 해당 건물에 속한 층 목록을 모두 조회합니다.
   * @param id 건물의 ID
   */
  @Get(`${API.BMS.SEGMENTS.BUILDINGS}/:id`)
  getBuildingDetail(@Param('id') id: number): Promise<Entities.Building> {
    const result = this.bmsService.getBuildingDetail(id);
    return result;
  }

  /**
   * @summary POST /api/bms/buildings - 건물 생성
   * @description 새로운 건물을 생성합니다.
   * @param body - 건물 생성을 위한 DTO
   * @returns 생성 성공 메시지
   */
  @Post(API.BMS.SEGMENTS.BUILDINGS)
  async CreateBuilding(
    @Body() body: Dto.CreateBuildingReqBody,
  ): Promise<Dto.CreateBuildingResult> {
    const result = await this.bmsService.createBuilding(body);
    return result;
  }

  /**
   * @summary DELETE /api/bms/buildings/:id - 특정 건물 삭제
   * @description 특정 건물에 대한 정보를 삭제합니다.
   * @param body - 건물 삭제를 위한 DTO
   */
  @Delete(API.BMS.SEGMENTS.BUILDINGS)
  async deleteBuildings(
    @Body() body: Dto.DeleteBuildingReqBody,
  ): Promise<Dto.DeleteBuildingResult> {
    const result = await this.bmsService.deleteBuilding(body.buildingId);
    return result;
  }
}
