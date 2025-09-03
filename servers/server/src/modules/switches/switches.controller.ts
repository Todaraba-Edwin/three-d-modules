import { Controller, Get, Query } from '@nestjs/common';
import * as API from '@src_apps/common/api';
import { GetSwitchInfoDto } from './dto';
import { SwitchesService } from './switches.service';

const {
  API_PREFIX,
  SWITCHES: {
    SEGMENTS: { BASE, SNMP, PORT_STATE },
  },
} = API;

@Controller(`${API_PREFIX}/${BASE}`)
export class SwitchesController {
  constructor(private readonly switchesService: SwitchesService) {}

  @Get(`${SNMP}/${PORT_STATE}`)
  getPortStates(@Query() getSwitchInfoDto: GetSwitchInfoDto): Promise<any> {
    return this.switchesService.getPortStates(getSwitchInfoDto);
  }
}
