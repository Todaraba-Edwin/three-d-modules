import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as snmp from 'net-snmp';
import { GetSwitchInfoDto } from './dto';

interface LLDPNeighbor {
  sysName: string;
  remotePortId: number | undefined;
}
@Injectable()
export class SwitchesService {
  private async _getSnmpLLDPInfo(
    session: any,
  ): Promise<Record<number, LLDPNeighbor>> {
    // LLDP OID
    const oid_sysName = '1.0.8802.1.1.2.1.4.1.1.9'; // lldpRemSysName
    const oid_portId = '1.0.8802.1.1.2.1.4.1.1.7'; // lldpRemPortId

    return new Promise((resolve, reject) => {
      const neighborsMap: Record<number, LLDPNeighbor> = {};

      // sysName subtree 조회
      session.subtree(
        oid_sysName,
        (varbinds) => {
          varbinds.forEach((vb) => {
            if (snmp.isVarbindError(vb)) return;
            const sysName = vb.value.toString().trim() || 'Unknown';
            const oidParts = vb.oid.split('.');
            const localPortNum = parseInt(oidParts[oidParts.length - 2], 10);

            if (!neighborsMap[localPortNum]) {
              neighborsMap[localPortNum] = {
                sysName,
                remotePortId: undefined,
              };
            }
          });
        },
        (error) => {
          if (error) {
            return reject(error);
          }

          // portId subtree 조회 후 매핑
          session.subtree(
            oid_portId,
            (varbinds) => {
              varbinds.forEach((vb) => {
                if (snmp.isVarbindError(vb)) return;
                const portId = vb.value.toString().trim() || 'Unknown';
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
        'start_port and end_port are required.',
      );
    }

    const oid_ifDescr = '1.3.6.1.2.1.2.2.1.2';
    const oid_ifAdmin = '1.3.6.1.2.1.2.2.1.7';
    const oid_ifOper = '1.3.6.1.2.1.2.2.1.8';
    const oid_iftype = '1.3.6.1.2.1.2.2.1.3';
    const oid_sysDescr = name_oid ? name_oid : '1.3.6.1.2.1.1.1.0';

    try {
      // 1️⃣ 스위치 이름 가져오기
      const switchName: string = await new Promise((resolve, reject) => {
        session.get([oid_sysDescr], (error, varbinds) => {
          if (error) return reject(error);
          console.log('Switch Name Varbinds:', varbinds[0].value?.toString());
          resolve(varbinds[0]?.value?.toString().trim() || '');
        });
      });

      // 2️⃣ 포트 목록 가져오기
      const ports: any[] = await new Promise((resolve, reject) => {
        const portPromises: Promise<any>[] = [];

        session.subtree(
          oid_ifDescr,
          (varbinds) => {
            varbinds.forEach((vb) => {
              if (!snmp.isVarbindError(vb)) {
                const oidParts = vb.oid.split('.');
                const portIndex = parseInt(oidParts[oidParts.length - 1], 10);

                if (portIndex >= start_port && portIndex <= end_port) {
                  const descr = vb.value.toString();
                  const adminOid = `${oid_ifAdmin}.${portIndex}`;
                  const operOid = `${oid_ifOper}.${portIndex}`;
                  const typeOid = `${oid_iftype}.${portIndex}`;

                  // 각 포트 상태 조회를 Promise로 감싸기
                  const portPromise = new Promise((res, rej) => {
                    session.get([adminOid, operOid, typeOid], (err, vbs) => {
                      if (err) return rej(err);

                      const adminStatus = vbs[0]?.value;
                      const operStatus = vbs[1]?.value;
                      const ifType = vbs[2]?.value;

                      res({
                        portIndex,
                        descr,
                        adminStatus: adminStatus === 1 ? 'UP' : 'DOWN',
                        operStatus: operStatus === 1 ? 'UP' : 'DOWN',
                        portType:
                          // [에시] 6은 ethernetCsmacd, 161은 opticalChannel
                          ifType === 6
                            ? 'LAN'
                            : ifType === 161
                              ? 'OPTICAL'
                              : 'ETC',
                      });
                    });
                  });

                  portPromises.push(portPromise);
                }
              }
            });
          },
          (error) => {
            if (error) return reject(error);

            // 모든 포트 상태 Promise가 끝날 때 resolve
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

// 예제 코드 : 주석 처리
// import { HttpService } from '@nestjs/axios';
// constructor(private readonly httpService: HttpService) {}

/*
  async getSnmpLLDPInfoWithPort(
    getSwitchPortStateDto: GetSwitchInfoDto,
  ): Promise<Record<number, LLDPNeighbor[]>> {
    const { ipAddress, username: community } = getSwitchPortStateDto;
    const session = snmp.createSession(ipAddress, community, {
      version: snmp.Version2c,
    });

    // LLDP OID
    const oid_sysName = '1.0.8802.1.1.2.1.4.1.1.9'; // lldpRemSysName
    const oid_portId = '1.0.8802.1.1.2.1.4.1.1.7'; // lldpRemPortId

    return new Promise((resolve, reject) => {
      const neighborsMap: Record<number, LLDPNeighbor[]> = {};

      // sysName subtree 조회
      session.subtree(
        oid_sysName,
        (varbinds) => {
          varbinds.forEach((vb) => {
            const sysName = vb.value.toString().trim() || 'Unknown';
            const oidParts = vb.oid.split('.');
            const localPortNum = parseInt(oidParts[oidParts.length - 2], 10);
            const remoteIndex = parseInt(oidParts[oidParts.length - 1], 10);

            if (!neighborsMap[localPortNum]) neighborsMap[localPortNum] = [];
            neighborsMap[localPortNum].push({
              sysName,
              remotePortId: '', // 나중에 portId 채워넣기
              remoteIndex,
            });
          });
        },
        (error) => {
          if (error) {
            session.close();
            return reject(error);
          }

          // portId subtree 조회 후 매핑
          session.subtree(
            oid_portId,
            (varbinds) => {
              varbinds.forEach((vb) => {
                const portId = vb.value.toString().trim() || 'Unknown';
                const oidParts = vb.oid.split('.');
                const localPortNum = parseInt(
                  oidParts[oidParts.length - 2],
                  10,
                );
                const remoteIndex = parseInt(oidParts[oidParts.length - 1], 10);

                const neighbors = neighborsMap[localPortNum];
                console.log('Neighbors for port', localPortNum, neighbors);
                if (neighbors) {
                  const neighbor = neighbors.find(
                    (n) => n.remoteIndex === remoteIndex,
                  );
                  if (neighbor) neighbor.remotePortId = portId;
                }
              });
            },
            (err) => {
              session.close();
              if (err) return reject(err);
              resolve(neighborsMap);
            },
          );
        },
      );
    });
  }
*/

/*
async getPortStateSnmpTest(
    getSwitchPortStateDto: GetSwitchInfoDto,
  ): Promise<any> {
    const {
      ipAddress,
      username: community,
      start_port,
      end_port,
    } = getSwitchPortStateDto;
    const ports: any[] = [];

    const session = snmp.createSession(ipAddress, community, {
      version: snmp.Version2c,
    });

    // --- DEBUGGING: Query only one simple OID ---
    const oidsToQuery: string[] = ['1.3.6.1.2.1.2.2.1.8'];

    try {
      const varbinds = await new Promise<any[]>((resolve, reject) => {
        session.get(oidsToQuery, (error, varbinds) => {
          console.error('SNMP get error (DEBUG):', error);
          if (error) {
            return reject(error);
          }
          resolve(varbinds);
        });
      });

      return varbinds;
    } catch (error) {
      console.error('SNMP fetching port state failed:', error.message);
      throw new InternalServerErrorException(
        'Failed to fetch port state via SNMP.',
      );
    } finally {
      session.close();
    }
  }
*/

/*
  async getHyesungPortStateSnmp(
    getSwitchPortStateDto: GetSwitchInfoDto,
  ): Promise<SwitchPortsSNMP> {
    const { ipAddress, username: community } = getSwitchPortStateDto;
    const ports: any[] = [];

    const session = snmp.createSession(ipAddress, community, {
      version: snmp.Version2c,
    });

    // --- DEBUGGING: Query only one simple OID ---
    const oidsToQuery: string[] = [
      '1.3.6.1.2.1.1.1.0', // sysDescr OID
      '1.3.6.1.2.1.2.2.1.7.1000001',
      '1.3.6.1.2.1.2.2.1.8.1000001',
      '1.3.6.1.2.1.2.2.1.7.1000002',
      '1.3.6.1.2.1.2.2.1.8.1000002',
      '1.3.6.1.2.1.2.2.1.7.1000003',
      '1.3.6.1.2.1.2.2.1.8.1000003',
      '1.3.6.1.2.1.2.2.1.7.1000004',
      '1.3.6.1.2.1.2.2.1.8.1000004',
      '1.3.6.1.2.1.2.2.1.7.1000005',
      '1.3.6.1.2.1.2.2.1.8.1000005',
      '1.3.6.1.2.1.2.2.1.7.1000006',
      '1.3.6.1.2.1.2.2.1.8.1000006',
      '1.3.6.1.2.1.2.2.1.7.1000007',
      '1.3.6.1.2.1.2.2.1.8.1000007',
      '1.3.6.1.2.1.2.2.1.7.1000008',
      '1.3.6.1.2.1.2.2.1.8.1000008',
      '1.3.6.1.2.1.2.2.1.7.1000009',
      '1.3.6.1.2.1.2.2.1.8.1000009',
      '1.3.6.1.2.1.2.2.1.7.1000010',
      '1.3.6.1.2.1.2.2.1.8.1000010',
      '1.3.6.1.2.1.2.2.1.7.1000011',
      '1.3.6.1.2.1.2.2.1.8.1000011',
      '1.3.6.1.2.1.2.2.1.7.1000012',
      '1.3.6.1.2.1.2.2.1.8.1000012',
    ];
    // --- END DEBUGGING ---

    try {
      const varbinds = await new Promise<any[]>((resolve, reject) => {
        session.get(oidsToQuery, (error, varbinds) => {
          console.error('SNMP get error (DEBUG):', error);
          if (error) {
            return reject(error);
          }
          resolve(varbinds);
        });
      });

      // OID 결과를 포트별로 파싱 (주석 처리된 부분은 그대로 둠)
      console.log('SNMP varbinds (DEBUG):', varbinds);
      for (let i = 0; i < varbinds.length; i++) {
        ports.push({
          port_oid: varbinds[i].oid,
          port_value: varbinds[i].value.toString(),
          port_type: varbinds[i].type,
        });
      }

      const responseData: SwitchPortsSNMP = ports.reduce((acc, curr) => {
        // console.log(curr.port_oid === '1.3.6.1.2.1.1.1.0');
        if (curr.port_oid === '1.3.6.1.2.1.1.1.0') {
          acc.port_name = curr.port_value;
        }
        if (curr.port_oid.includes('1.3.6.1.2.1.2.2.1')) {
          const portNum: string = curr.port_oid.split('.').pop() || '';
          const isSettingOID = curr.port_oid.split('.')[9] === '7';
          console.log('Current varbind:', curr);
          console.log(isSettingOID);

          const exportNum =
            portNum.length > 5
              ? parseInt(portNum.slice(1), 10)
              : parseInt(portNum, 10);
          console.log('Port number extracted:', exportNum);

          const portState = curr.port_value === '1' ? 'up' : 'down';

          acc[`port_${exportNum}`] = {
            ...acc[`port_${exportNum}`],
            ...(isSettingOID && { port_setting: portState }),
            ...(!isSettingOID && { port_status: portState }),
          };
        }

        return acc;
      }, {});

      console.log('Parsed SNMP response data:', responseData);

      return responseData;
    } catch (error) {
      console.error('SNMP fetching port state failed:', error.message);
      throw new InternalServerErrorException(
        'Failed to fetch port state via SNMP.',
      );
    } finally {
      session.close();
    }
  }
*/

/*

private parsePortStateString(data: string): HyesungPortStateDto[] {
    try {
      const parts = data.split('|').slice(2); // 첫 두 요소(메타데이터)는 무시
      const portStates: HyesungPortStateDto[] = [];

      for (const portString of parts) {
        if (!portString || !portString.includes('/')) continue;

        const details = portString.split('/');
        if (details.length < 8) continue; // 유효한 데이터인지 확인

        const portType = details[1].includes('jack_copper') ? 'LAN' : 'OPTICAL';

        const portState: HyesungPortStateDto = {
          port_number: parseInt(details[0], 10),
          port_activation: !details[2].includes('Down'),
          port_type: portType,
          meta: {
            image: details[1],
            label: details[2],
            x: parseInt(details[3], 10),
            y: parseInt(details[4], 10),
            w: parseInt(details[5], 10),
            h: parseInt(details[6], 10),
            direction: parseInt(details[7], 10),
          },
        };
        portStates.push(portState);
      }
      return portStates;
    } catch (error) {
      console.error('Error parsing port state string:', error);
      throw new InternalServerErrorException(
        'Failed to parse port state data.',
      );
    }
  }
  async getHyesungPortState(
    getSwitchPortStateDto: GetSwitchInfoDto,
  ): Promise<HyesungPortStateDto[]> {
    const { ipAddress, username, password } = getSwitchPortStateDto;

    const credentials = `${username}:${password}`;
    const encodedCredentials = Buffer.from(credentials).toString('base64');
    const authHeader = `Basic ${encodedCredentials}`;

    console.log('authHeader', authHeader);

    try {
      const portStateUrl = `http://${ipAddress}/stat/portstate`;
      const response = await firstValueFrom(
        this.httpService.get<string>(portStateUrl, {
          // 응답 타입을 string으로 지정
          headers: {
            Authorization: authHeader,
            'User-Agent': 'Mozilla/5.0',
          },
        }),
      );

      return this.parsePortStateString(response.data) as HyesungPortStateDto[];
    } catch (error) {
      console.error(
        'Fetching port state failed:',
        error.response?.data || error.message,
      );
      throw new InternalServerErrorException('Failed to fetch port state.');
    }
  }
*/
