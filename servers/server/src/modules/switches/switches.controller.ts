import { Body, Controller, Post } from '@nestjs/common';
import * as API from '@src_apps/common/api';
import { GetSwitchInfoDto } from './dto';
import { SwitchesService } from './switches.service';

const { SEGMENTS } = API.SWITCHES;

@Controller(`${API.API_PREFIX}/${SEGMENTS.BASE}`)
export class SwitchesController {
  constructor(private readonly switchesService: SwitchesService) {}

  @Post(`snmp/${SEGMENTS.PORT_STATE}`) // New endpoint path
  getPortStates(@Body() getSwitchInfoDto: GetSwitchInfoDto): Promise<any> {
    return this.switchesService.getPortStates(getSwitchInfoDto);
  }
}
