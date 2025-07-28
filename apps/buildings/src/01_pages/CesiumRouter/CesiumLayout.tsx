import { usePathSegments } from '@monorepo/shared';
import type { ReactNode } from 'react';
import * as RD from 'react-router-dom';

export const CesiumLayout = (): ReactNode => {
  const { layout } = usePathSegments();
  const navigate = RD.useNavigate();
  const utilsNavigate = (url: string) => () => navigate(url);
  const isCurrentSegment = (targetSegment: string) => {
    return targetSegment === layout ? 'text-red-200' : '';
  };
  return (
    <div className='CesiumLayout'>
      <ol className='absolute top-0 right-[10px] z-[99] bg-white p-[4px]'>
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
            className={isCurrentSegment(pageName === 'home' ? '' : pageName) + ' cursor-pointer'}
            onClick={utilsNavigate(url)}
            children={pageName}
          />
        ))}
      </ol>
      <RD.Outlet />
    </div>
  );
};
