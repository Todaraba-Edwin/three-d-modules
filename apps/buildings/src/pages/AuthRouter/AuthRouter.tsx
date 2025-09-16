import { type RouteObject } from 'react-router-dom';
import { AuthLayout, Login } from './_wigets';

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
