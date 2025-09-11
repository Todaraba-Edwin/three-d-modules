import { SystemAdmin } from '@/01_pages/DefaultRouter/_wigets/SystemAdmin/SystemAdmin';
import { DeviceManagement } from '@/01_pages/DefaultRouter/_wigets/SystemAdmin/features/DeviceManagement/DeviceManagement';
import { UserManagement } from '@/01_pages/DefaultRouter/_wigets/SystemAdmin/features/UserManagement/UserManagement';
import { useEffect, type ReactNode } from 'react';
import { useNavigate, type RouteObject } from 'react-router-dom';
import { useAuthStore } from '../../02_common/zustandStores/useAuthStore';
import { DefaultMainFrame } from './DefaultMainFrame';
import { defaultMenuLists } from './_shared/const';

const pathPages: Record<string, ReactNode> = {
  ['/']: <div>대시보드 페이지 개발 중...</div>,
  // '/system-admin' 경로는 중첩 라우팅으로 인해 아래에서 별도 처리됩니다.
};

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

  if (!findPath) return <></>;

  // /system-admin은 Outlet을 사용하므로, pathPages에서 찾지 않고 SystemAdmin 컴포넌트를 직접 렌더링합니다.
  if (validationPath === '/system-admin') {
    return <SystemAdmin />;
  }

  if (!pathPages[findPath.path])
    return <div>{findPath.label} 페이지 개발 중...</div>;
  return pathPages[findPath.path];
};

export const DefaultRouter = (): RouteObject[] => {
  const adminRoutePath = '/system-admin';
  const otherRoutes = defaultMenuLists
    .slice(1)
    .filter(({ path }) => path !== adminRoutePath);

  return [
    {
      path: '/',
      element: <DefaultMainFrame />,
      children: [
        { index: true, element: pathPages['/'] },
        { path: '*', element: <div>찾을 수 없음</div> },

        // ✅ 중첩라우팅이 필요하지 않은, 라우팅 처리
        ...otherRoutes.map(({ path }) => ({
          path,
          element: <PermittedRoute validationPath={path} />,
        })),

        // ✅ system-admin 의 경우, 중첩라우팅
        {
          path: adminRoutePath,
          element: <PermittedRoute validationPath={adminRoutePath} />,
          children: [
            { index: true, element: <UserManagement /> },
            { path: 'device', element: <DeviceManagement /> },
          ],
        },
      ],
    },
  ];
};
