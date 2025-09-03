import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as snmp from 'net-snmp';
import { ERROR_MESSAGE, OID, SWITCHES_ENUM } from './const';
import {
  GetPortStateResDto,
  GetPortStatesReqParams,
  SetPostSnmpResultDto,
  SnmpResultDto,
} from './dto';

interface LLDPNeighbor {
  sysName: string;
  remotePortId: number | '';
}
@Injectable()
export class SwitchesService {
  private async _getSnmpLLDPInfo(
    session: any,
  ): Promise<Record<number, LLDPNeighbor>> {
    return new Promise((resolve, reject) => {
      const neighborsMap: Record<number, LLDPNeighbor> = {};

      // 1. Get System Names
      session.subtree(
        OID.NEIGHBOR_SYSTEM_NAME,
        (neighbor: SnmpResultDto[]) => {
          neighbor.forEach((list) => {
            if (snmp.isVarbindError(list)) return;
            const sysName =
              list.value.toString().trim() || SWITCHES_ENUM.UNKNOWN;
            const oidParts = list.oid.split('.');
            const localPortNum = parseInt(oidParts[oidParts.length - 2], 10);

            if (!neighborsMap[localPortNum]) {
              neighborsMap[localPortNum] = {
                sysName,
                remotePortId: '',
              };
            }
          });
        },
        (error) => {
          if (error) return reject(error);

          // 2. Get Port IDs
          session.subtree(
            OID.NEIGHBOR_PORT_ID,
            (neighbor_ports: SnmpResultDto[]) => {
              neighbor_ports.forEach((list) => {
                if (snmp.isVarbindError(list)) return;
                const portId =
                  list.value.toString().trim() || SWITCHES_ENUM.UNKNOWN;
                const oidParts = list.oid.split('.');
                const localPortNum = parseInt(
                  oidParts[oidParts.length - 2],
                  10,
                );
                const neighbor = neighborsMap[localPortNum];
                if (neighbor) {
                  neighbor.remotePortId = parseInt(portId, 10);
                }
              });
            },
            (err: any) => {
              if (err) return reject(err);
              resolve(neighborsMap);
            },
          );
        },
      );
    });
  }

  async getPortStates(
    getPortStatesReqParams: GetPortStatesReqParams,
  ): Promise<GetPortStateResDto> {
    const { ipAddress, community, name_oid, start_port, end_port } =
      getPortStatesReqParams;
    const session = snmp.createSession(ipAddress, community, {
      version: snmp.Version2c,
    });
    if (!start_port || !end_port) {
      throw new InternalServerErrorException(
        ERROR_MESSAGE.PORT_OID_START_END_REQUIRED,
      );
    }

    try {
      // 1️⃣ 스위치 이름 가져오기
      const switchName: string = await new Promise((resolve, reject) => {
        session.get(
          [name_oid || OID.SYSTEM_NAME],
          (error: any, data: SnmpResultDto[]) => {
            if (error) return reject(error);
            const name =
              data[0]?.value?.toString().trim() || SWITCHES_ENUM.UNKNOWN;
            resolve(name);
          },
        );
      });

      // 2️⃣ 포트 목록 가져오기
      const ports: SetPostSnmpResultDto[] = await new Promise(
        (resolve, reject) => {
          const portPromises: Promise<any>[] = [];

          session.subtree(
            OID.PORT_DESCRIPTION,
            (ports: SnmpResultDto[]) => {
              ports.forEach((list) => {
                if (!snmp.isVarbindError(list)) {
                  const oidParts = list.oid.split('.');
                  const portIndex = parseInt(oidParts[oidParts.length - 1], 10);

                  if (portIndex >= start_port && portIndex <= end_port) {
                    const description = list.value.toString();
                    const configStatusOid = `${OID.PORT_CONFIG_STATUS}.${portIndex}`;
                    const operStatusOid = `${OID.PORT_OPER_STATUS}.${portIndex}`;
                    const portTypeOid = `${OID.PORT_TYPE}.${portIndex}`;

                    // 각 포트 상태 조회를 Promise로 감싸기
                    const portPromise = new Promise((res, rej) => {
                      session.get(
                        [configStatusOid, operStatusOid, portTypeOid],
                        (err: any, list: SnmpResultDto[]) => {
                          if (err) return rej(err);

                          const configStatus = list[0]?.value;
                          const operStatus = list[1]?.value;
                          const portType = list[2]?.value;

                          res({
                            portIndex,
                            description,
                            configStatus:
                              configStatus === SWITCHES_ENUM.IS_ACTIVE
                                ? SWITCHES_ENUM.UP
                                : SWITCHES_ENUM.DOWN,
                            operStatus:
                              operStatus === SWITCHES_ENUM.IS_ACTIVE
                                ? SWITCHES_ENUM.UP
                                : SWITCHES_ENUM.DOWN,
                            type:
                              portType === SWITCHES_ENUM.ETHERNER_CSMACD
                                ? SWITCHES_ENUM.LAN
                                : portType === SWITCHES_ENUM.OPTICAL_CHANNEL
                                  ? SWITCHES_ENUM.OPTICAL
                                  : SWITCHES_ENUM.ETC,
                          });
                        },
                      );
                    });

                    portPromises.push(portPromise);
                  }
                }
              });
            },
            (error: any) => {
              if (error) return reject(error);

              Promise.all(portPromises)
                .then((results) => {
                  resolve(results);
                })
                .catch(reject);
            },
          );
        },
      );

      // 3️⃣ LLDP 정보 가져오기
      const lldpNeighbors = await this._getSnmpLLDPInfo(session);

      // 4️⃣ 포트 정보에 LLDP 정보 추가
      const portsWithLldp = ports.map((port) => {
        const neighbor = lldpNeighbors[port.portIndex];
        return {
          ...port,
          lldpNeighbor: neighbor || {},
        };
      });

      return {
        ipAddress,
        switchName,
        ports: portsWithLldp,
      };
    } finally {
      session.close();
    }
  }
}
