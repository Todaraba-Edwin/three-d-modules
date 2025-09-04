import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as snmp from 'net-snmp';
import * as Const from './const';
import * as Types from './dto';
import * as Fns from './utils/snmp.utils';

@Injectable()
export class SwitchesService {
  async getPortStates(
    reqParams: Types.GetPortStatesReqParams,
  ): Promise<Types.GetPortStateResDto> {
    const { ipAddress, community, name_oid, start_port, end_port } = reqParams;

    if (!start_port || !end_port) {
      throw new InternalServerErrorException(
        Const.ERROR_MESSAGE.PORT_OID_START_END_REQUIRED,
      );
    }

    const session = snmp.createSession(ipAddress, community, {
      version: snmp.Version2c,
    });

    try {
      // 1. 스위치 이름과 LLDP 정보를 병렬로 가져오기
      const [switchNameVarbind, lldpNeighbors] = await Promise.all([
        Fns.snmpGetPromise(session, [name_oid || Const.OID.SYSTEM_NAME]),
        Fns.snmpGetLldpNeighbors(session),
      ]);

      const switchName =
        switchNameVarbind[0]?.value?.toString().trim() ||
        Const.SWITCHES_ENUM.UNKNOWN;

      // 2. 포트 목록 정보 가져오기 (Description 기준)
      const portDescriptionOids: string[] = [];
      for (let i = start_port; i <= end_port; i++) {
        portDescriptionOids.push(`${Const.OID.PORT_DESCRIPTION}.${i}`);
      }

      const portDescriptions = await Fns.snmpGetPromise(
        session,
        portDescriptionOids,
      );

      // 3. 각 포트의 상세 정보(상태, MAC)를 병렬로 가져오기
      const portDetailPromises = portDescriptions
        .filter((vb) => !snmp.isVarbindError(vb) && vb.value.toString())
        .map(async (vb) => {
          const portIndex = parseInt(vb.oid.split('.').pop() || '0', 10);
          const description = vb.value.toString();

          const detailOids = [
            `${Const.OID.PORT_CONFIG_STATUS}.${portIndex}`,
            `${Const.OID.PORT_OPER_STATUS}.${portIndex}`,
            `${Const.OID.PORT_MAC_ADDRESS}.${portIndex}`,
          ];

          const [PORT_CONFIG_STATUS, PORT_OPER_STATUS, PORT_MAC_ADDRESS] =
            await Fns.snmpGetPromise(session, detailOids);

          const configStatus = PORT_CONFIG_STATUS?.value;
          const operStatus = PORT_OPER_STATUS?.value;
          const portMAC = PORT_MAC_ADDRESS?.value as Buffer;
          const portNum = Fns.utilsSwitchDevicePortNum(portIndex);
          const neighbor = lldpNeighbors[portNum] || {};

          const result: Types.SetPostSnmpResultDto = {
            portIndex: portNum,
            portMAC: Fns.utilFormatMacAddress(portMAC),
            description,
            configStatus:
              configStatus === Const.SWITCHES_ENUM.IS_ACTIVE
                ? Const.SWITCHES_ENUM.UP
                : Const.SWITCHES_ENUM.DOWN,
            operStatus:
              operStatus === Const.SWITCHES_ENUM.IS_ACTIVE
                ? Const.SWITCHES_ENUM.UP
                : Const.SWITCHES_ENUM.DOWN,
            lldpNeighbor: neighbor,
          };
          return result;
        });

      const ports = await Promise.all(portDetailPromises);

      return {
        ipAddress,
        switchName,
        ports,
      };
    } finally {
      session.close();
    }
  }
}
