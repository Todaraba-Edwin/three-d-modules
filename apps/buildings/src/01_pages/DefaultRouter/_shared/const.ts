import {
  Camera,
  Home,
  Info,
  Network,
  Settings,
  Shield,
  type LucideProps,
} from 'lucide-react';
export const LayoutSize = {
  GNB_OPEN_W: 250,
  GNB_PADDING: 16,
  GNB_ICON: 24,
  GNB_FOOTER: 100,
  GNB_FOOTER_CLOSE: 60,
  get GNB_CLOSE_W() {
    return this.GNB_ICON + this.GNB_PADDING * 2; // 48
  },
  get GNB_CONTENT() {
    return this.GNB_OPEN_W - this.GNB_PADDING * 2; // 218
  },
  get GNB_REST() {
    return this.GNB_CONTENT - this.GNB_ICON - this.GNB_PADDING; // 194
  },
};

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
