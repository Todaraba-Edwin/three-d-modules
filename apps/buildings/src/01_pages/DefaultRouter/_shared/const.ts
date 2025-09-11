import { Camera, Home, Info, Network, Settings, Shield, X } from 'lucide-react';

export const noneIcon = X;
export const defaultMenuLists: menuItemsType[] = [
  { path: '/', icon: Home },
  { path: '/lms', icon: Network },
  { path: '/fms', icon: Camera },
  { path: '/system-info', icon: Info },
  { path: '/system-admin', icon: Shield },
  { path: '/settings', icon: Settings },
];
