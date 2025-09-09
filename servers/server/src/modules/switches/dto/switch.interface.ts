import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class GetPortStatesReqParams {
  @IsString()
  ipAddress: string;

  @IsString()
  community: string;

  @IsOptional()
  @IsString()
  name_oid?: string;

  @IsOptional()
  @IsString()
  lldt_find_id_oid?: string;

  @IsInt()
  @Type(() => Number)
  start_port: number;

  @IsInt()
  @Type(() => Number)
  end_port: number;
}

export class LLDPNeighbor {
  sysName: string;
  remotePortNum: number | '';
  remotePortIP: string;
  remotePortMAC: string;
}

export class SetPostSnmpResultDto {
  portIndex: number;
  description: string;
  configStatus: 'UP' | 'DOWN';
  operStatus: 'UP' | 'DOWN';
  portMAC: string;
  lldpNeighbor: LLDPNeighbor;
}

export class GetPortStateResDto {
  ipAddress: string;
  switchName: string;
  ports: SetPostSnmpResultDto[];
}

export class SnmpResultDto {
  value: Buffer | string | number;
  oid: string;
}
