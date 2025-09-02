import { Body, Controller, Post } from '@nestjs/common';
import * as API from '@src_apps/common/api';
import { GetSwitchInfoDto, HyesungPortStateDto } from './dto';
import { SwitchesService } from './switches.service';

const { SEGMENTS } = API.SWITCHES;

@Controller(`${API.API_PREFIX}/${SEGMENTS.BASE}`)
export class SwitchesController {
  constructor(private readonly switchesService: SwitchesService) {}

  /**
   * @summary POST /api/switches/hyesung/port-state - HYESUNG 스위치 포트 상태 조회 (HTTP)
   * @description HYESUNG 스위치의 포트 상태 정보를 HTTP 기반으로 가져옵니다.
   * @param GetSwitchInfoDto - 스위치 접속 정보 (ipAddress, username, password)
   * @returns 포트 상태 정보 배열
   */
  @Post(`${SEGMENTS.HYESUNG}/${SEGMENTS.PORT_STATE}`)
  getHyesungPortState(
    @Body() GetSwitchInfoDto: GetSwitchInfoDto,
  ): Promise<HyesungPortStateDto[]> {
    return this.switchesService.getHyesungPortState(GetSwitchInfoDto);
  }
}
