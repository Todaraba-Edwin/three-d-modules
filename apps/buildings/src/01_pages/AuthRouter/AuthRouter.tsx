import { type RouteObject } from 'react-router-dom';
import { AuthLayout } from './AuthLayout';
import { Button } from './Button';
import { ButtonLogin } from './ButtonLogin';
import { ButtonLogout } from './ButtonLogout';

export const AuthRouter: RouteObject[] = [
  {
    path: '/login',
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: (
          <div>
            <hr />
            <p>로그인</p>
            <ButtonLogin />
            <br />
            <Button />
            <br />
            <ButtonLogout />
          </div>
        ),
      },
    ],
  },
];
