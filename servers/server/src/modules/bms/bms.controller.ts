import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import * as API from '@src_apps/common/api';
import { AuthAdminGuard } from '../auth/auth.guard';
import { BmsService } from './bms.service';
import { Building } from './dto';

@Controller(`${API.API_PREFIX}/${API.BMS.SEGMENTS.BASE}`)
@UseGuards(AuthAdminGuard)
export class BmsController {
  constructor(private readonly bmsService: BmsService) {}

  /**
   * @summary GET /api/bms/buildings - 건물 목록 조회
   * @description 건물 목록을 조회합니다. 검색어(q)를 통해 건물 이름 또는 주소로 필터링할 수 있습니다.
   * @param q 건물 이름 또는 주소로 검색하기 위한 검색어
   */
  @Get(API.BMS.SEGMENTS.BUILDINGS)
  getBuildings(
    @Query(API.BMS.PARAMS.SEARCH) search?: string,
  ): Promise<Building[]> {
    return this.bmsService.getBuildings(search);
  }
}
