import { IsString, IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
export class GetSwitchInfoDto {
  ipAddress: string;
  username: string;
  password: string;
  name_oid?: string;
  start_port?: number;
  end_port?: number;
}

export class PortMeta {
  image: string;
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
  direction: number;
}

export class HyesungPortStateDto {
  port_number: number;
  port_activation: boolean;
  port_type: 'LAN' | 'OPTICAL';
  meta: PortMeta;
}

// 각 포트의 상태 타입
export class SwitchPortInfo {
  port_setting: 'up' | 'down';
  port_status: 'up' | 'down';
}

// 전체 스위치 타입
export class SwitchPortsSNMP {
  port_name: string;
  [key: `port_${number}`]: SwitchPortInfo; // 가변 포트
}

export class GetSwitchReqParams {
  @IsString()
  ipAddress: string;

  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsInt()
  @Type(() => Number)
  start_port: number;

  @IsInt()
  @Type(() => Number)
  end_port: number;

  @IsOptional()
  @IsString()
  name_oid?: string;
}
