import clsx from 'clsx';
import type { ReactNode } from 'react';
import { isMobile } from 'react-device-detect';
import * as RD from 'react-router-dom';

export const AuthLayout = (): ReactNode => {
  return (
    <div
      className={clsx(
        'min-h-screen flex items-center justify-center p-4 relative',
        isMobile
          ? ''
          : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'
      )}
    >
      <RD.Outlet />
    </div>
  );
};
