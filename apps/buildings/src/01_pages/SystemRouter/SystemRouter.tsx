import type { RouteObject } from 'react-router-dom';

import { SystemLayout } from './SystemLayout';

export const SystemRouter: RouteObject[] = [
  {
    path: '/system',
    element: <SystemLayout />,
    children: [
      { index: true, element: <div>시스템</div> },
      { path: '1', element: <div children='1페이지' /> },
      { path: '2', element: <div children='2페이지' /> },
      { path: '3', element: <div children='3페이지' /> },
      { path: '4', element: <div children='4페이지' /> },
    ],
  },
];
