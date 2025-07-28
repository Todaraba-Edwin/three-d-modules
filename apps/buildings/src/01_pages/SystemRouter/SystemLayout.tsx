import { usePathSegments } from '@monorepo/shared';
import type { ReactNode } from 'react';
import * as RD from 'react-router-dom';

export const SystemLayout = (): ReactNode => {
  const { currentSegments } = usePathSegments();
  const navigate = RD.useNavigate();
  const utilsNavigate = (url: string) => () => navigate(url);
  const isCurrentSegment = (targetSegment: string) => {
    return targetSegment === currentSegments ? 'text-red-200' : '';
  };
  return (
    <div className='SystemLayout'>
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
          {
            pageName: '1',
            url: '1',
          },
          {
            pageName: '2',
            url: '2',
          },
          {
            pageName: '3',
            url: '3',
          },
          {
            pageName: '4',
            url: '4',
          },
        ].map(({ pageName, url }) => (
          <li
            key={pageName}
            className={isCurrentSegment(pageName === 'system' ? '' : pageName)}
            onClick={utilsNavigate(url)}
            children={pageName}
          />
        ))}
      </ol>
      <RD.Outlet />
    </div>
  );
};
