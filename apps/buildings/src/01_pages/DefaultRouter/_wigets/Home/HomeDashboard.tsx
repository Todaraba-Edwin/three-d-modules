import clsx from 'clsx';
import { type ReactNode } from 'react';

import { HomeFeatureManagements } from './features/HomeFeatureManagements';
import { HomeHeader } from './features/HomeHeader';
import { HomeNavigation } from './features/HomeNavigation';
import { HomeNetworkManagements } from './features/HomeNetworkManagements';

export const HomeDashboard = (): ReactNode => {
  return (
    <div className={clsx('w-full', 'space-y-4')}>
      <HomeHeader />
      <HomeNavigation />
      <HomeNetworkManagements />
      <HomeFeatureManagements />
      {/* <HomeFeatureManagements /> */}
    </div>
  );
};
