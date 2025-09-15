import { type ReactNode } from 'react';

import clsx from 'clsx';
import { NavLink, Outlet } from 'react-router-dom';
import { NMSHeader } from './features/NMSHeader';

const tabs = [
  { name: '네트워크 전체 구성도', href: '/nms' },
  { name: '네트워크 연결정보', href: '/nms/info' },
  //   { name: '스위치 상세정보', href: '/nms/info-switch' },
  //   { name: '장비 상세정보', href: '/nms/info-device' },
];

export const NMSRouterOutlet = (): ReactNode => {
  return (
    <div
      className={clsx('w-full h-full', 'grid grid-rows-[auto_1fr] space-y-4')}
    >
      <NMSHeader />

      <div className='grid grid-rows-[auto_1fr] min-h-0'>
        <div className='border-b border-gray-200'>
          <nav className='-mb-px flex space-x-4' aria-label='Tabs'>
            {tabs.map(tab => (
              <NavLink
                key={tab.name}
                to={tab.href}
                end // 하위 경로가 활성화되는 것을 방지
                className={({ isActive }) =>
                  clsx(
                    isActive
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                    'whitespace-nowrap border-b-2 py-2 px-1 font-medium'
                  )
                }
              >
                {tab.name}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className={clsx('pt-4 max-xl:pb-4', 'xl:overflow-y-auto')}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};
