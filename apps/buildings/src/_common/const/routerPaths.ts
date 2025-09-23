import {
  Box,
  Camera,
  Home,
  Info,
  Network,
  Settings,
  Shield,
  X,
} from 'lucide-react';

export const AuthPathEnum = {
  // 로그인 관련
  LOGIN: '/login',
};

export const DefaultPathEnum = {
  ROOT: '/',
  THREE_D_MS: '/3dms',
  NETWORK_MS: {
    BASE: '/nms',
    SEGMENTS: {
      FLOW_MAP: 'flow-map',
      INFO: 'info',
      INFO_SWITCH: 'info-switch',
      INFO_DEVICE: 'info-device',
    },
  },
  FACILITY_MS: '/fms',
  SYSTEM_INFO: {
    BASE: '/system-info',
    SEGMENTS: {
      DEVICE: 'device',
    },
  },
  SYSTEM_ADMIN: {
    BASE: '/system-admin',
    SEGMENTS: {
      DEVICE: 'device',
    },
  },
  SYSTEM_SETTINGS: '/settings',
  NOT_FOUND: '*',
} as const;

export const noneIcon = X;
export const menuLists: menuListsType[] = [
  { path: DefaultPathEnum.ROOT, icon: Home, desc: '' },
  {
    path: DefaultPathEnum.THREE_D_MS,
    icon: Box,
    desc: '디지털 트윈(3D) 건물 관제',
  },
  {
    path: DefaultPathEnum.NETWORK_MS.BASE,
    icon: Network,
    desc: '스위치 기반 네트워크관리 시스템',
  },
  {
    path: DefaultPathEnum.FACILITY_MS,
    icon: Camera,
    desc: '시설물 관리 시스템',
  },
  {
    path: DefaultPathEnum.SYSTEM_INFO.BASE,
    icon: Info,
    desc: '납품된 제품의 라이선스 및 시스템 사양 정보를 확인합니다.',
  },
  {
    path: DefaultPathEnum.SYSTEM_ADMIN.BASE,
    icon: Shield,
    desc: '관리자 모드에서 사용자 및 장비를 제어합니다.',
  },
  {
    path: DefaultPathEnum.SYSTEM_SETTINGS,
    icon: Settings,
    desc: '시스템을 설정합니다.',
  },
];

export const pathWithoutNestedRouter = ({
  nestedPaths,
}: {
  nestedPaths: string[];
}): menuListsType[] => {
  return menuLists.slice(1).filter(({ path }) => !nestedPaths.includes(path));
};
