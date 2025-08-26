import { router } from '../router';
import type { ReactNode } from 'react';
import * as RD from 'react-router-dom';

export const RouterProviderTemplates = (): ReactNode => {
  return <RD.RouterProvider router={router} />;
};