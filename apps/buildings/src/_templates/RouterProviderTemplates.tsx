import { router } from '@/_templates/loader/router';
import type { ReactNode } from 'react';
import * as RD from 'react-router-dom';

export const RouterProviderTemplates = (): ReactNode => (
  <RD.RouterProvider router={router} />
);
