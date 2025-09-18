import dayjs from 'dayjs';
import { Shield } from 'lucide-react';

export const QUICKSTART_LOGIN_LIST: QuickStartLoginType[] = [
  {
    username: 'admin',
    password: '1234',
    role: '최고 관리자',
    description: '최고 관리자 권한',
    icon: Shield,
    color: 'bg-red-50 border-red-200 text-red-700',
  },
  {
    username: 'test',
    password: '1234',
    role: '중간 관리자',
    description: '중간 관리자 권한',
    icon: Shield,
    color: 'bg-blue-50 border-blue-200 text-blue-700',
  },
  {
    username: 'user',
    password: '1234',
    role: '사용자',
    description: '일반 사용자 권한',
    icon: Shield,
    color: 'bg-green-50 border-green-200 text-green-700',
  },
];

export const MANUFACTURE_INFO: ManufactureInfoType = {
  PROJECT_NAME: 'PRIZM',
  PROJECT_FULL_NAME: `Projection planes for resource integration\nin zone-based management`,
  PROJECT_DESC: '3D 모델 기반 건물관리 시스템',
  PROGRAM_PROVIDER: `(주) PCN © 2020-${dayjs().format('YYYY')}`,
};
