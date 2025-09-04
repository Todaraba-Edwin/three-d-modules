import { Controller, Get, Query } from '@nestjs/common';
import * as API from '@src_apps/common/api';
import * as Types from './dto';
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
  getPortStates(
    @Query() reqParams: Types.GetPortStatesReqParams,
  ): Promise<Types.GetPortStateResDto> {
    return this.switchesService.getPortStates(reqParams);
  }

  @Get(`${SNMP}/test`)
  getSnmpTest(
    @Query() reqParams: Types.GetPortStatesReqParams,
  ): Promise<string> {
    return this.switchesService.getSnmpTest(reqParams);
  }
}
