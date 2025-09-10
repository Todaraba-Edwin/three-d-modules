import { Controller, Get, UseGuards } from '@nestjs/common';
import * as API from '@src_apps/common/api';
import { AuthGuard } from '../auth/auth.guard';
import { SummaryResDto } from './dto';
import { SystemAdminService } from './system-admin.service';

@Controller(`${API.API_PREFIX}/${API.SYSTEM_ADMIN.SEGMENTS.BASE}`)
@UseGuards(AuthGuard)
export class SystemAdminController {
  constructor(private readonly systemAdminService: SystemAdminService) {}

  /**
   * @summary GET /api/system-admin/summary - 시스템 요약 정보 조회
   * @returns 사용자 수, 스위치 모델 수, 스위치 수, 장비 수
   */
  @Get(API.SYSTEM_ADMIN.SEGMENTS.SUMMARY)
  getSummary(): Promise<SummaryResDto> {
    return this.systemAdminService.getSummary();
  }
}
