import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as snmp from 'net-snmp';
import { firstValueFrom } from 'rxjs';
import { GetSwitchInfoDto, HyesungPortStateDto } from './dto';

@Injectable()
export class SwitchesService {
  constructor(private readonly httpService: HttpService) {}

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
          port_actived: !details[2].includes('Down'),
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

  /**
   * @summary HYESUNG 스위치에서 SNMP를 통해 포트 상태 조회
   * @description
   * SNMPv2c를 사용하여 스위치의 포트 상태 정보를 가져옵니다.
   * OID: .1.3.6.1.2.1.2.2.1.7 (ifAdminStatus), .1.3.6.1.2.1.2.2.1.8 (ifOperStatus)
   * .1.3.6.1.2.1.2.2.1.2 (ifDescr), .1.3.6.1.2.1.2.2.1.3 (ifType)
   *
   * @param getSwitchPortStateDto - IP 주소, 커뮤니티 문자열(username 필드 사용) 포함 DTO
   * @returns 포트 상태 정보 배열
   * @throws {InternalServerErrorException} SNMP 통신 실패 시
   */
  async getHyesungPortStateSnmp(
    getSwitchPortStateDto: GetSwitchInfoDto,
  ): Promise<any[]> {
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

      return ports;
    } catch (error) {
      console.error('SNMP fetching port state failed:', error.message);
      throw new InternalServerErrorException(
        'Failed to fetch port state via SNMP.',
      );
    } finally {
      session.close();
    }
  }
}
