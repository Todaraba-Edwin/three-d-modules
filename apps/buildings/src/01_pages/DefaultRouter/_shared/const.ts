import {
  Camera,
  Home,
  Info,
  Network,
  Settings,
  Shield,
  type LucideProps,
} from 'lucide-react';

export type menuItemsType = {
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
  >;
  label: string;
  path: string;
};

export const menuItems: menuItemsType[] = [
  { icon: Home, label: '대시보드', path: '/' },
  { icon: Network, label: 'LMS 관리', path: '/lms' },
  { icon: Camera, label: 'FMS 관리', path: '/fms' },
  { icon: Info, label: '정보', path: '/system-info' },
  { icon: Settings, label: '설정', path: '/settings' },
];

export const menuItemsAdmin: menuItemsType[] = [
  { icon: Home, label: '대시보드', path: '/' },
  {
    icon: Shield,
    label: '관리자',
    path: '/system-admin',
  },
  { icon: Network, label: 'LMS 관리', path: '/lms' },
  { icon: Camera, label: 'FMS 관리', path: '/fms' },
  { icon: Info, label: '정보', path: '/system-info' },
  { icon: Settings, label: '설정', path: '/settings' },
];
