export class GetSwitchInfoDto {
  ipAddress: string;
  username: string;
  password: string;
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
  port_actived: boolean;
  port_type: 'LAN' | 'OPTICAL';
  meta: PortMeta;
}
