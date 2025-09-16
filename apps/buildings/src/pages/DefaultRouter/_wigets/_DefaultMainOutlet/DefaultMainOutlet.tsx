import { useState, type ReactNode } from 'react';
import * as RD from 'react-router-dom';
import { useAuthStore } from '../../../../_common/zustandStores/useAuthStore';
import { ExpirationSession } from '../_reactPortals/ExpirationSession';
import { DefaultMainFrameLayout } from './DefaultMainFrameLayout';

export const DefaultMainOutlet = (): ReactNode => {
  const [isFocusLogin, setIsFocusLogin] = useState<boolean>(false);
  const { nickname, permissions } = useAuthStore();
  const permissionPaths = permissions.filter(({ can_access }) => can_access);

  return (
    <DefaultMainFrameLayout
      setIsFocusLogin={setIsFocusLogin}
      permissionPaths={permissionPaths}
      nickname={nickname}
    >
      <RD.Outlet />
      {isFocusLogin && <ExpirationSession />}
    </DefaultMainFrameLayout>
  );
};
