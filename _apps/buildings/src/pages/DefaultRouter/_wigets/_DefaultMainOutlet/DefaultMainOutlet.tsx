import { useAuthStore } from '@/_common/zustandStores';
import { useState, type ReactNode } from 'react';
import * as RD from 'react-router-dom';
import { ExpirationSessionPortal } from '../_reactPortals';
import { DefaultMainOutletLayout } from './DefaultMainOutletLayout';

export const DefaultMainOutlet = (): ReactNode => {
  const [isExpirationSession, setIsExpirationSession] =
    useState<boolean>(false);
  const { nickname, permissions } = useAuthStore();
  const permissionPaths = permissions.filter(({ can_access }) => can_access);

  return (
    <DefaultMainOutletLayout
      {...{ setIsExpirationSession, permissionPaths, nickname }}
    >
      <RD.Outlet />
      {isExpirationSession && <ExpirationSessionPortal />}
    </DefaultMainOutletLayout>
  );
};
