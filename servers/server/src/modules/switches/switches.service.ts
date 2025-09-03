import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as snmp from 'net-snmp';
import { GetSwitchInfoDto } from './dto';

const OID = {
  NEIGHBOR_SYSTEM_NAME: '1.0.8802.1.1.2.1.4.1.1.9',
  NEIGHBOR_PORT_ID: '1.0.8802.1.1.2.1.4.1.1.7',
  SYSTEM_NAME: '1.3.6.1.2.1.1.1.0',
  PORT_DESCRIPTION: '1.3.6.1.2.1.2.2.1.2',
  PORT_CONFIG_STATUS: '1.3.6.1.2.1.2.2.1.7',
  PORT_OPER_STATUS: '1.3.6.1.2.1.2.2.1.8',
  PORT_TYPE: '1.3.6.1.2.1.2.2.1.3',
};

enum SWITCHES_ENUM {
  UNKNOWN = 'UNKNOWN',
  UP = 'UP',
  DOWN = 'DOWN',
  LAN = 'LAN',
  OPTICAL = 'OPTICAL',
  ETC = 'ETC',

  //
  IS_ACTIVE = 1,
  NON_ACTIVE = 2,
  ETHERNER_CSMACD = 6,
  OPTICAL_CHANNEL = 161,
}

const ERROR_MESSAGE = {
  PORT_OID_START_END_REQUIRED: 'start_port and end_port are required.',
};

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
        (varbinds) => {
          varbinds.forEach((vb) => {
            if (snmp.isVarbindError(vb)) return;
            const sysName = vb.value.toString().trim() || SWITCHES_ENUM.UNKNOWN;
            const oidParts = vb.oid.split('.');
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
            (varbinds) => {
              varbinds.forEach((vb) => {
                if (snmp.isVarbindError(vb)) return;
                const portId =
                  vb.value.toString().trim() || SWITCHES_ENUM.UNKNOWN;
                const oidParts = vb.oid.split('.');
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
            (err) => {
              if (err) return reject(err);
              resolve(neighborsMap);
            },
          );
        },
      );
    });
  }

  async getPortStates(getSwitchPortStateDto: GetSwitchInfoDto): Promise<any> {
    const {
      ipAddress,
      username: community,
      name_oid,
      start_port,
      end_port,
    } = getSwitchPortStateDto;
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
        session.get([name_oid || OID.SYSTEM_NAME], (error, varbinds) => {
          if (error) return reject(error);
          resolve(varbinds[0]?.value?.toString().trim() || '');
        });
      });

      // 2️⃣ 포트 목록 가져오기
      const ports: any[] = await new Promise((resolve, reject) => {
        const portPromises: Promise<any>[] = [];

        session.subtree(
          OID.PORT_DESCRIPTION,
          (varbinds) => {
            varbinds.forEach((vb) => {
              if (!snmp.isVarbindError(vb)) {
                const oidParts = vb.oid.split('.');
                const portIndex = parseInt(oidParts[oidParts.length - 1], 10);

                if (portIndex >= start_port && portIndex <= end_port) {
                  const description = vb.value.toString();
                  const configStatusOid = `${OID.PORT_CONFIG_STATUS}.${portIndex}`;
                  const operStatusOid = `${OID.PORT_OPER_STATUS}.${portIndex}`;
                  const portTypeOid = `${OID.PORT_TYPE}.${portIndex}`;

                  // 각 포트 상태 조회를 Promise로 감싸기
                  const portPromise = new Promise((res, rej) => {
                    session.get(
                      [configStatusOid, operStatusOid, portTypeOid],
                      (err, vbs) => {
                        if (err) return rej(err);

                        const configStatus = vbs[0]?.value;
                        const operStatus = vbs[1]?.value;
                        const portType = vbs[2]?.value;

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
          (error) => {
            if (error) return reject(error);

            Promise.all(portPromises)
              .then((results) => {
                resolve(results);
              })
              .catch(reject);
          },
        );
      });

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
