import { AuthRouter, CesiumRouter, DefaultRouter, SystemRouter } from '@pages';
import type { ReactNode } from 'react';
import * as RD from 'react-router-dom';

const router = RD.createBrowserRouter([
  ...DefaultRouter,
  ...CesiumRouter,
  ...AuthRouter,
  ...SystemRouter,
]);
export const RouterProviderTemplates = (): ReactNode => {
  return <RD.RouterProvider router={router} />;
};
