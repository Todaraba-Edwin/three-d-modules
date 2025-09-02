import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { GetSwitchInfoDto, HyesungPortStateDto } from './dto';

// net-snmp 라이브러리 임포트

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
    GetSwitchInfoDto: GetSwitchInfoDto,
  ): Promise<HyesungPortStateDto[]> {
    const { ipAddress, username, password } = GetSwitchInfoDto;

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
}
