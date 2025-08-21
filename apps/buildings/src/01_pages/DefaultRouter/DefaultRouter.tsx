import { Home } from '@/02_widgets/Home/Home';
import type { RouteObject } from 'react-router-dom';
import { DefaultLayout } from './DefaultLayout';

export const DefaultRouter: RouteObject[] = [
  {
    path: '/',
    element: <DefaultLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: '*', element: <div>찾을 수 없음</div> },
    ],
  },
];
