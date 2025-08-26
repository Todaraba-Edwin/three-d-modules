import { AuthLayout, Login } from '@/02_widgets/Auth';
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
