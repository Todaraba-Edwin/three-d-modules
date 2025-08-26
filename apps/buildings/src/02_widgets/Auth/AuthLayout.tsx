import type { ReactNode } from 'react';
import * as RD from 'react-router-dom';

export const AuthLayout = (): ReactNode => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4 relative'>
      <RD.Outlet />
    </div>
  );
};
