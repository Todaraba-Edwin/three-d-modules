import { Box, Camera, Home, Info, Network, Settings, Shield, X } from 'lucide-react';

export const noneIcon = X;
export const defaultMenuLists: menuItemsType[] = [
  { path: '/', icon: Home, desc: ''},
  { path: '/3dms', icon: Box, desc: '디지털 트윈(3D) 건물 관제'},
  { path: '/lms', icon: Network, desc: '광선로(Core) 기반 관리 시스템'},
  { path: '/fms', icon: Camera, desc: '시설물 관리 시스템'},
  { path: '/system-info', icon: Info, desc: '시스템 정보를 조회합니다.'},
  { path: '/system-admin', icon: Shield, desc: '관리자 모드에서 사용자 및 장비를 제어합니다.'},
  { path: '/settings', icon: Settings, desc: '시스템을 설정합니다.'},
];
