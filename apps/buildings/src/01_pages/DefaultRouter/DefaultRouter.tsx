import { Home } from '@/02_widgets/Home/Home';
import { useEffect } from 'react';
import { useNavigate, type RouteObject } from 'react-router-dom';
import { useAuthStore } from '../useAuthStore';
import { DefaultLayout } from './DefaultLayout';
import { defaultMenuLists } from './_shared/const';

const PermittedRoute = ({ validationPath }: { validationPath: string }) => {
  const { permissions } = useAuthStore();
  const navigate = useNavigate();
  const findPath = permissions.find(({ path }) => path === validationPath);
  useEffect(() => {
    const isFIndPathPermission = findPath && findPath.can_access;
    if (isFIndPathPermission) return;

    // ✅ window.history를 체크하여 루트경로를 보장하며 되돌리기 실행
    const isHistory = window.history.state && window.history.state.idx > 0;
    if (isHistory) {
      navigate(-1);
    } else {
      navigate('/', { replace: true });
    }
  }, [findPath, navigate]);

  return <>{findPath?.label}</>;
};

export const DefaultRouter = (): RouteObject[] => {
  useAuthStore.getState();
  return [
    {
      path: '/',
      element: <DefaultLayout />,
      children: [
        // ✅ 루트경로에 대한 Permission
        { index: true, element: <Home /> },
        { path: '*', element: <div>찾을 수 없음</div> },
        // ✅ 접근경로에 대한 validate Permissions
        ...defaultMenuLists.slice(1).map(({ path }) => {
          return {
            path,
            element: <PermittedRoute validationPath={path} />,
          };
        }),
      ],
    },
  ];
};
