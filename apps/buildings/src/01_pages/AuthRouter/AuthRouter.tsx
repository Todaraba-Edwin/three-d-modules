import type { RouteObject } from 'react-router-dom';
import { AuthLayout } from './AuthLayout';

export const AuthRouter: RouteObject[] = [
  {
    path: '/login',
    element: <AuthLayout />,
    children: [{ index: true, element: <div>로그인</div> }],
  },
];
