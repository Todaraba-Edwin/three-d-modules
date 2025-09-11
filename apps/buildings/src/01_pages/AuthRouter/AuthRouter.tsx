import { AuthLayout, Login } from '@/01_pages/AuthRouter/_wigets';
import { type RouteObject } from 'react-router-dom';

export const AuthRouter: RouteObject[] = [
  {
    path: '/login',
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <Login />,
      },
    ],
  },
];
