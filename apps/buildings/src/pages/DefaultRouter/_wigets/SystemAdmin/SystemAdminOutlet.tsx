import { DefaultPathEnum } from '@/_common/const';
import clsx from 'clsx';
import { type ReactNode } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { SystemAdminHeader } from './features/SystemAdminHeader';
import { SystemAdminSummary } from './features/SystemAdminSummary';

const { BASE, SEGMENTS } = DefaultPathEnum.SYSTEM_ADMIN;

const tabs = [
  { name: '사용자 관리', href: `${BASE}` },
  { name: '건물 관리', href: `${BASE}/${SEGMENTS.BUILDINGS}` },
];

export const SystemAdminOutlet = (): ReactNode => {
  return (
    <div
      className={clsx(
        'w-full h-full',
        'grid grid-rows-[auto_auto_1fr] space-y-4'
      )}
    >
      <SystemAdminHeader />
      <SystemAdminSummary />
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
