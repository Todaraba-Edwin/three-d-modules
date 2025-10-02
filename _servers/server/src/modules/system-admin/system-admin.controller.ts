import { Body, Controller, Delete, Get, UseGuards } from '@nestjs/common';
import * as API from '@src_apps/modules/_api';
import { AuthGuard } from '../auth/auth.guard';
import * as Dto from './dto';
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
  getSummary(): Promise<Dto.SummaryResult> {
    return this.systemAdminService.getSummary();
  }

  /**
   * @summary GET /api/system-admin/permissions-roles - 사용자 역할별 정보 조회
   * @returns 역할별 메뉴접근 진위값
   */
  @Get(API.SYSTEM_ADMIN.SEGMENTS.PERMISSIONS_ROLES)
  getPermissionsByRoles(): Promise<Dto.PermissionsByRoleResDto[]> {
    return this.systemAdminService.getPermissionsByRole();
  }

  /**
   * @summary DELETE /api/system-admin/permissions-roles - 역할 삭제
   * @param body roleIds - 삭제할 역할 ID 배열
   * @param body force - 강제 삭제 여부
   */
  @Delete(API.SYSTEM_ADMIN.SEGMENTS.PERMISSIONS_ROLES)
  deleteRoles(@Body() body: Dto.DeleteRolesReqDto): Promise<void> {
    return this.systemAdminService.deleteRoles(body.roleIds, body.force);
  }
}
