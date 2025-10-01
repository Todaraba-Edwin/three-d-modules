import { useAuthStore } from '@/_common/zustandStores';
import { useState, type ReactNode } from 'react';
import * as RD from 'react-router-dom';
import { ExpirationSessionPortal } from '../_reactPortals';
import { DefaultMainOutletLayout } from './DefaultMainOutletLayout';

export const DefaultMainOutlet = (): ReactNode => {
  const [isFocusLogin, setIsFocusLogin] = useState<boolean>(false);
  const { nickname, permissions } = useAuthStore();
  const permissionPaths = permissions.filter(({ can_access }) => can_access);

  return (
    <DefaultMainOutletLayout
      {...{ setIsFocusLogin, permissionPaths, nickname }}
    >
      <RD.Outlet />
      {isFocusLogin && <ExpirationSessionPortal />}
    </DefaultMainOutletLayout>
  );
};
