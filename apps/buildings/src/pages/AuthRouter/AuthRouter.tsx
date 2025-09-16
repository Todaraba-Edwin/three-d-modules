import { Outlet, type RouteObject } from 'react-router-dom';
import { LoginPage } from './_wigets';

export const AuthRouter: RouteObject[] = [
  {
    path: '/login',
    element: <Outlet />,
    children: [
      {
        index: true,
        element: <LoginPage />,
      },
    ],
  },
];
