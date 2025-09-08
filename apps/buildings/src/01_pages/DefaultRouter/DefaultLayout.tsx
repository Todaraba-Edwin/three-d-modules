import { useState, type ReactNode } from 'react';
import * as RD from 'react-router-dom';
import { useAuthStore } from '../useAuthStore';
import { menuItems, menuItemsAdmin, type menuItemsType } from './_shared/const';
import { ExpirationSession } from './_wigets/ExpirationSession';
import { Layout } from './_wigets/Layout';

export const DefaultLayout = (): ReactNode => {
  const [isFocusLogin, setIsFocusLogin] = useState<boolean>(false);

  const { userType, nickname } = useAuthStore();
  const isAdmin = userType === 'ADMIN_MAIN';
  const gmbMenuItems: menuItemsType[] = isAdmin ? menuItemsAdmin : menuItems;

  return (
    <Layout
      setIsFocusLogin={setIsFocusLogin}
      gmbMenuItems={gmbMenuItems}
      nickname={nickname}
    >
      <RD.Outlet />
      {isFocusLogin && <ExpirationSession />}
    </Layout>
  );
};
