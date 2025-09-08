import { useState, type ReactNode } from 'react';
import * as RD from 'react-router-dom';
import { ExpirationSession } from './_wigets/ExpirationSession';
import { Layout } from './_wigets/Layout';

export const DefaultLayout = (): ReactNode => {
  const [isFocusLogin, setIsFocusLogin] = useState<boolean>(false);
  return (
    <Layout setIsFocusLogin={setIsFocusLogin}>
      <RD.Outlet />
      {isFocusLogin && <ExpirationSession />}
    </Layout>
  );
};
