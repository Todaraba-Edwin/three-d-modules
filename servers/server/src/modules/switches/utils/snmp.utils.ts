import * as snmp from 'net-snmp';
import { OID, PORT_BASE_INDEX, SWITCHES_ENUM } from '../const';
import { LLDPNeighbor, SnmpResultDto } from '../dto';

export const utilsSwitchDevicePortNum = (portIndex: number): number => {
  const isHyesung = portIndex > PORT_BASE_INDEX.HYESUNG;

  if (isHyesung) {
    return portIndex - PORT_BASE_INDEX.HYESUNG;
  }

  return portIndex;
};

export const utilFormatMacAddress = (
  mac: Buffer | string | number | null | undefined,
): string => {
  if (!mac) return '';

  // 1️⃣ 문자열이면 (ASCII 형태)
  if (typeof mac === 'string') {
    return mac.replace(/-/g, ':').toLowerCase();
  }

  // 2️⃣ 버퍼이면
  if (Buffer.isBuffer(mac)) {
    // 길이가 6이면 일반 OctetString MAC
    if (mac.length === 6) {
      return Array.from(mac)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join(':');
    }

    // 길이가 17 이상이면 아마 ASCII 문자열이 버퍼로 변환된 경우
    const str = mac.toString('utf-8').trim();
    if (str.match(/^([0-9A-Fa-f]{2}([-:])){5}([0-9A-Fa-f]{2})$/)) {
      return str.replace(/-/g, ':').toLowerCase();
    }

    // 그 외는 6바이트 단위로 처리
    return Array.from(mac)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join(':');
  }

  return '';
};

/**
 * snmp.get 요청을 Promise로 감싸는 래퍼 함수
 */
export const snmpGetPromise = (
  session: any,
  oids: string[],
): Promise<SnmpResultDto[]> => {
  return new Promise((resolve, reject) => {
    session.get(oids, (error: Error | null, varbinds: SnmpResultDto[]) => {
      if (error) return reject(error);
      resolve(varbinds);
    });
  });
};

/**
 * snmp.subtree 요청을 Promise로 감싸는 래퍼 함수
 */
export const snmpSubtreePromise = (
  session: any,
  oid: string,
): Promise<SnmpResultDto[]> => {
  return new Promise((resolve, reject) => {
    const varbinds: SnmpResultDto[] = [];
    session.subtree(
      oid,
      (vars: SnmpResultDto[]) => varbinds.push(...vars),
      (error: Error | null) => {
        if (error) return reject(error);
        resolve(varbinds);
      },
    );
  });
};

/**
 * LLDP를 사용하여 이웃 장비 정보를 비동기적으로 수집
 * @param session net-snmp 세션
 * @returns 이웃 정보를 담은 객체
 */
export const snmpGetLldpNeighbors = async (
  session: any,
): Promise<Record<number, LLDPNeighbor>> => {
  const neighborsMap: Record<number, LLDPNeighbor> = {};

  // 1. System Name, Port ID, MAC 주소를 병렬로 동시에 요청
  const [systemNames, portIds, macAddresses, ipAddress] = await Promise.all([
    snmpSubtreePromise(session, OID.NEIGHBOR_SYSTEM_NAME),
    snmpSubtreePromise(session, OID.NEIGHBOR_PORT_ID),
    snmpSubtreePromise(session, OID.NEIGHBOR_MAC),
    snmpSubtreePromise(session, OID.NEIGHBOR_IP),
  ]);

  // 2. System Name 처리
  systemNames.forEach((list) => {
    if (snmp.isVarbindError(list)) return;
    const sysName = list.value.toString().trim() || SWITCHES_ENUM.UNKNOWN;
    const oidParts = list.oid.split('.');
    const localPortNum = parseInt(oidParts[oidParts.length - 2], 10);
    if (!neighborsMap[localPortNum]) {
      neighborsMap[localPortNum] = {
        sysName,
        remotePortNum: '',
        remotePortIP: '',
        remotePortMAC: '',
      };
    }
  });

  // 3. Port ID 처리
  portIds.forEach((list) => {
    if (snmp.isVarbindError(list)) return;
    const portId = list.value.toString().trim() || SWITCHES_ENUM.UNKNOWN;
    const oidParts = list.oid.split('.');
    const localPortNum = parseInt(oidParts[oidParts.length - 2], 10);
    const neighbor = neighborsMap[localPortNum];

    if (neighbor) {
      neighbor.remotePortNum = parseInt(portId, 10);
    }
  });

  // 4. MAC 주소 처리
  macAddresses.forEach((list) => {
    if (snmp.isVarbindError(list)) return;
    const portMAC = list.value as Buffer;
    const oidParts = list.oid.split('.');
    const localPortNum = parseInt(oidParts[oidParts.length - 2], 10);
    const neighbor = neighborsMap[localPortNum];

    if (neighbor) {
      neighbor.remotePortMAC = utilFormatMacAddress(portMAC);
    }
  });

  // 5. IP 주소 처리
  ipAddress.forEach((list) => {
    if (snmp.isVarbindError(list)) return;
    const lldpPortIP = `${list.oid.split('.').slice(16).join('.')} (IPv4)`;
    const localPortNum = utilsSwitchDevicePortNum(
      parseInt(list.oid.split('.')[12], 10),
    );

    const neighbor = neighborsMap[localPortNum];

    if (neighbor) {
      neighbor.remotePortIP = lldpPortIP;
    }
  });

  return neighborsMap;
};
