import clsx from 'clsx';
import { type ReactNode } from 'react';
import { NMSHeader } from './features/NMSHeader';
import { NMSMain } from './features/NMSMain';

export const NetworkManagement = (): ReactNode => {
  return (
    <div
      className={clsx('w-full h-full', 'grid grid-rows-[auto_1fr] space-y-4')}
    >
      <NMSHeader />
      <NMSMain />
    </div>
  );
};
