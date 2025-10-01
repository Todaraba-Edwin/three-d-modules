import { AuthPathEnum } from '@/_common/const';
import { type RouteObject } from 'react-router-dom';
import { LoginPage } from './_wigets';

export const AuthRouter: RouteObject[] = [
  {
    path: AuthPathEnum.LOGIN,
    element: <LoginPage />,
  },
];
