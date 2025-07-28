import type { RouteObject } from 'react-router-dom';
import { Building } from './Building/Building';
import { CesiumLayout } from './CesiumLayout';

export const CesiumRouter: RouteObject[] = [
  {
    path: '/building',
    element: <CesiumLayout />,
    children: [{ index: true, element: <Building /> }],
  },
];
