export const OID = {
  NEIGHBOR_SYSTEM_NAME: '1.0.8802.1.1.2.1.4.1.1.9',
  NEIGHBOR_PORT_ID: '1.0.8802.1.1.2.1.4.1.1.7',
  NEIGHBOR_ADDRESS: '1.0.8802.1.1.2.1.4.2.1',
  SYSTEM_NAME: '1.3.6.1.2.1.1.1.0',
  PORT_DESCRIPTION: '1.3.6.1.2.1.2.2.1.2',
  PORT_CONFIG_STATUS: '1.3.6.1.2.1.2.2.1.7',
  PORT_OPER_STATUS: '1.3.6.1.2.1.2.2.1.8',
  // PORT_TYPE: '1.3.6.1.2.1.2.2.1.9',
};

export enum SWITCHES_ENUM {
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

export const ERROR_MESSAGE = {
  PORT_OID_START_END_REQUIRED: 'start_port and end_port are required.',
};

export const PORT_BASE_INDEX = {
  HYESUNG: 1000000,
}
