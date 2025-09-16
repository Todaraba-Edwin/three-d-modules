import { DefaultPathEnum, menuLists } from '@/_common/const';
import { type ReactNode } from 'react';
import { type RouteObject } from 'react-router-dom';
import { PermittedRoute } from './_shared';
import * as Wigets from './_wigets';

const {
  ROOT,
  SYSTEM_ADMIN,
  SYSTEM_INFO,
  THREE_D_MS,
  NETWORK_MS,
  FACILITY_MS,
  NOT_FOUND,
} = DefaultPathEnum;

const pathPages: Record<string, ReactNode> = {
  [ROOT]: <Wigets.HomeDashboardPage />,
  [THREE_D_MS]: <Wigets.ThreeDMsPage />,
  [SYSTEM_INFO.BASE]: <Wigets.SystemInfoPage />,

  // 중첩 레이아웃 - Outlet
  [SYSTEM_ADMIN.BASE]: <Wigets.SystemAdminOutlet />,
  [NETWORK_MS.BASE]: <Wigets.NMSRouterOutlet />,
  [FACILITY_MS]: <Wigets.FMSRouterOutlet />,
};

const NestedRoutesOptions = ({ path }: { path: string }): RouterOptionType => {
  return {
    path,
    element: <PermittedRoute validationPath={path} pathPages={pathPages} />,
  };
};

export const DefaultRouter = (): RouteObject[] => {
  const otherRoutes = menuLists
    .slice(1)
    .filter(
      ({ path }) =>
        ![
          SYSTEM_ADMIN.BASE as string,
          FACILITY_MS as string,
          NETWORK_MS.BASE as string,
        ].includes(path)
    );

  return [
    {
      path: DefaultPathEnum.ROOT,
      element: <Wigets.DefaultMainOutlet />,
      children: [
        { index: true, element: pathPages[ROOT] },
        { path: NOT_FOUND, element: <div>찾을 수 없음</div> },

        // ✅ 중첩라우팅이 필요하지 않은 일반 경로 PATHS
        ...otherRoutes.map(({ path }) => ({
          path,
          element: (
            <PermittedRoute validationPath={path} pathPages={pathPages} />
          ),
        })),

        // ⚠️ 중첩라우팅 : SYSTEM_ADMIN.BASE
        {
          ...NestedRoutesOptions({ path: SYSTEM_ADMIN.BASE }),
          children: [
            { index: true, element: <Wigets.UserManagementPage /> },
            {
              path: SYSTEM_ADMIN.SEGMENTS.DEVICE,
              element: <Wigets.DeviceManagementPage />,
            },
          ],
        },

        // ⚠️ 중첩라우팅 : NETWORK_MS.BASE
        {
          ...NestedRoutesOptions({ path: NETWORK_MS.BASE }),
          children: [
            { index: true, element: <Wigets.NMSTopology /> },
            {
              path: NETWORK_MS.SEGMENTS.INFO,
              element: <Wigets.NMSMain />,
            },
            {
              path: NETWORK_MS.SEGMENTS.INFO_SWITCH,
              element: <Wigets.NMSSwitchInfo />,
            },
            {
              path: NETWORK_MS.SEGMENTS.INFO_DEVICE,
              element: <Wigets.NMSDeviceInfo />,
            },
          ],
        },

        // ⚠️ 중첩라우팅 : FACILITY_MS
        {
          ...NestedRoutesOptions({ path: FACILITY_MS }),
          children: [{ index: true, element: <Wigets.FMSDeviceInfo /> }],
        },
      ],
    },
  ];
};
