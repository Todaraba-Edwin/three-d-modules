import clsx from 'clsx';
import { type ReactNode } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { FMSHeader } from './features/FMSHeader';

const tabs = [
  { name: '장비 상세보기', href: '/fms' },
  // { name: '장비정보 간추려보기', href: '/fms' },
  // { name: '사업관리', href: '/fms/project' },
];

export const FMSRouterOutlet = (): ReactNode => {
  return (
    <div
      className={clsx('w-full h-full', 'grid grid-rows-[auto_1fr] space-y-4')}
    >
      <FMSHeader />
      <div className='grid grid-rows-[auto_1fr] min-h-0'>
        <div className='border-b border-gray-200'>
          <nav className='-mb-px flex space-x-4' aria-label='Tabs'>
            {tabs.map(tab => (
              <NavLink
                key={tab.name}
                to={tab.href}
                end
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
