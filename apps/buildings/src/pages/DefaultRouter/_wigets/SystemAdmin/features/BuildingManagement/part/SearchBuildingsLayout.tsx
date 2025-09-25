import clsx from 'clsx';
import { type PropsWithChildren, type ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { SearchBuildingBody } from './SearchBuildingBody';

const Layout = ({ children }: PropsWithChildren): ReactNode => {
  return (
    <div
      className={clsx('grid', 'grid-cols-[350px_1fr] space-x-4 h-full min-h-0')}
      children={children}
    />
  );
};

export const SearchBuildingsLayout = (): ReactNode => {
  return (
    <Layout>
      <SearchBuildingBody />
      <Outlet />
    </Layout>
  );
};
