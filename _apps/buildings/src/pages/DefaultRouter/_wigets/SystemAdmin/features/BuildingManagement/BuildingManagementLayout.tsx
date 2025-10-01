import clsx from 'clsx';
import { type PropsWithChildren, type ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { BM_LeftBuildingList } from './part/BM_LeftBuildingList';

const Layout = ({ children }: PropsWithChildren): ReactNode => {
  return (
    <div
      className={clsx(
        'grid',
        'xl:grid-cols-[350px_1fr] xl:space-x-4 xl:h-full xl:min-h-0',
        'grid-cols-1 gap-y-4',
        'max-xl:grid-rows-[auto_1fr]'
      )}
      children={children}
    />
  );
};

export const BuildingManagementLayout = (): ReactNode => (
  <Layout>
    <BM_LeftBuildingList />
    <Outlet />
  </Layout>
);
