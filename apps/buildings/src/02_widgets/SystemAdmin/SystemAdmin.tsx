import clsx from 'clsx';
import { type ReactNode } from 'react';
import { SystemAdminHeader } from './features/SystemAdminHeader';
import { SystemAdminSummary } from './features/SystemAdminSummary';

export const SystemAdmin = (): ReactNode => {
  return (
    <div
      className={clsx(
        'w-full h-full',
        'grid grid-rows-[auto_auto_1fr] space-y-4'
      )}
    >
      <SystemAdminHeader />
      <SystemAdminSummary />
      <div className={clsx('border-2 border-violet-600 overflow-scroll')}>
        {Array.from({ length: 100 }, (_, idx) => idx).map(list => (
          <p key={list}>{list}줄</p>
        ))}
      </div>
    </div>
  );
};
