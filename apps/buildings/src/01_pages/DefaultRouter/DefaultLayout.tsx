import { useState, type ReactNode } from 'react';
import * as RD from 'react-router-dom';
import { useAuthStore } from '../useAuthStore';
import { ExpirationSession } from './_wigets/ExpirationSession';
import { Layout } from './_wigets/Layout';

export const DefaultLayout = (): ReactNode => {
  const [isFocusLogin, setIsFocusLogin] = useState<boolean>(false);
  const { nickname, permissions } = useAuthStore();
  const permissionPaths = permissions.filter(({ can_access }) => can_access);

  return (
    <Layout
      setIsFocusLogin={setIsFocusLogin}
      permissionPaths={permissionPaths}
      nickname={nickname}
    >
      <RD.Outlet />
      {isFocusLogin && <ExpirationSession />}
    </Layout>
  );
};
