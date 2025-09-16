import { SystemAdmin } from '@/pages/DefaultRouter/_wigets/SystemAdmin/SystemAdmin';
import { DeviceManagement } from '@/pages/DefaultRouter/_wigets/SystemAdmin/features/DeviceManagement/DeviceManagement';
import { UserManagement } from '@/pages/DefaultRouter/_wigets/SystemAdmin/features/UserManagement/UserManagement';
import { useEffect, type ReactNode } from 'react';
import { useNavigate, type RouteObject } from 'react-router-dom';
import { defaultMenuLists } from '../../_common/const/routerPaths';
import { useAuthStore } from '../../_common/zustandStores/useAuthStore';
import { Building } from './Building/Building';
import { DefaultMainFrame } from './DefaultMainFrame';
import { FMSRouterOutlet } from './_wigets/FMS/FMSRouterOutlet';
import { FMSDeviceInfo } from './_wigets/FMS/features/FMSDeviceInfo';
import { HomeDashboard } from './_wigets/Home/HomeDashboard';
import { NMSRouterOutlet } from './_wigets/NMS/NMSRouterOutlet';
import { NMSDeviceInfo } from './_wigets/NMS/features/NMSDeviceInfo';
import { NMSMain } from './_wigets/NMS/features/NMSMain';
import { NMSSwitchInfo } from './_wigets/NMS/features/NMSSwitchInfo';
import { NMSTopology } from './_wigets/NMS/features/NMSTopology';
import { SystemInfoPage } from './_wigets/SystemInfo/SystemInfoPage';

const pathPages: Record<string, ReactNode> = {
  ['/']: <HomeDashboard />,
  ['/system-admin']: <SystemAdmin />,
  ['/3dms']: <Building />,
  ['/nms']: <NMSRouterOutlet />,
  ['/fms']: <FMSRouterOutlet />,
  ['/system-info']: <SystemInfoPage />,
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

  if (!findPath || !pathPages[findPath.path])
    return <div>{findPath ? findPath.label : ''} 페이지 개발 중...</div>;
  return pathPages[findPath.path];
};

export const DefaultRouter = (): RouteObject[] => {
  // const threeDRouterPath = '/3dms';
  const nmsRoutePath = '/nms';
  const fmsRoutePath = '/fms';
  const adminRoutePath = '/system-admin';
  const otherRoutes = defaultMenuLists.slice(1).filter(
    ({ path }) =>
      ![
        adminRoutePath,
        fmsRoutePath,
        nmsRoutePath,
        // threeDRouterPath,
      ].includes(path)
  );

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

        // ✅ nms 의 경우, 중첩라우팅
        {
          path: nmsRoutePath,
          element: <PermittedRoute validationPath={nmsRoutePath} />,
          children: [
            { index: true, element: <NMSTopology /> },
            { path: 'info', element: <NMSMain /> },
            { path: 'info-switch', element: <NMSSwitchInfo /> },
            { path: 'info-device', element: <NMSDeviceInfo /> },
          ],
        },

        // ✅ fms 의 경우, 중첩라우팅
        {
          path: fmsRoutePath,
          element: <PermittedRoute validationPath={fmsRoutePath} />,
          children: [
            { index: true, element: <FMSDeviceInfo /> },
            // { path: 'detail', element: <FMSDeviceInfo /> },
            // { path: 'project', element: <div children='개발예정' /> },
          ],
        },
      ],
    },
  ];
};
