import clsx from 'clsx';
import { type ReactNode } from 'react';

import { HomeHeader } from './features/HomeHeader';
import { HomeNavigation } from './features/HomeNavigation';
// import { HomeFeatureManagements } from './features/HomeFeatureManagements';
// import { HomeNetworkManagements } from './features/HomeNetworkManagements';

export const HomeDashboardPage = (): ReactNode => {
  return (
    <div className={clsx('w-full', 'space-y-4')}>
      <HomeHeader />
      <HomeNavigation />
      {/* <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
        <HomeNetworkManagements />
        <HomeFeatureManagements />
      </div> */}
    </div>
  );
};
