import { usePathSegments } from '@monorepo/shared';
import type { ReactNode } from 'react';
import * as RD from 'react-router-dom';

export const AuthLayout = (): ReactNode => {
  const { layout } = usePathSegments();
  const navigate = RD.useNavigate();
  const utilsNavigate = (url: string) => () => navigate(url);
  const isCurrentSegment = (targetSegment: string) => {
    return layout === targetSegment ? 'text-red-200' : '';
  };
  return (
    <div className='AuthLayout'>
      <ol>
        {[
          {
            pageName: 'home',
            url: '/',
          },
          {
            pageName: 'building',
            url: '/building',
          },
          {
            pageName: 'system',
            url: '/system',
          },
          {
            pageName: 'login',
            url: '/login',
          },
        ].map(({ pageName, url }) => (
          <li
            key={pageName}
            className={isCurrentSegment(pageName)+ ' cursor-pointer'}
            onClick={utilsNavigate(url)}
            children={pageName}
          />
        ))}
      </ol>
      <RD.Outlet />
    </div>
  );
};
