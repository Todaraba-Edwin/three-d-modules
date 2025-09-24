import * as Const from '@/_common/const';
import { type ReactNode } from 'react';
import { type RouteObject } from 'react-router-dom';
import { PermittedRouteOption } from './_shared';
import * as Wigets from './_wigets';

const {
  ROOT,
  SYSTEM_ADMIN,
  SYSTEM_INFO,
  THREE_D_MS,
  NETWORK_MS,
  FACILITY_MS,
  NOT_FOUND,
} = Const.DefaultPathEnum;

const pathPages: Record<string, ReactNode> = {
  [ROOT]: <Wigets.HomeDashboardPage />,
  [THREE_D_MS]: <Wigets.ThreeDMsPage />,
  [SYSTEM_INFO.BASE]: <Wigets.SystemInfoPage />,

  // ⚠️ 중첩라우팅 Layout With Outlet
  [SYSTEM_ADMIN.BASE]: <Wigets.SystemAdminOutlet />,
  [NETWORK_MS.BASE]: <Wigets.NMSRouterOutlet />,
  [FACILITY_MS]: <Wigets.FMSRouterOutlet />,
};

export const DefaultRouter = (): RouteObject[] => {
  const restRoutes = Const.pathWithoutNestedRouter({
    nestedPaths: [
      SYSTEM_ADMIN.BASE as string,
      FACILITY_MS as string,
      NETWORK_MS.BASE as string,
    ],
  });

  return [
    {
      path: ROOT,
      element: <Wigets.DefaultMainOutlet />,
      children: [
        { index: true, element: pathPages[ROOT] },
        { path: NOT_FOUND, element: <div>찾을 수 없음</div> },

        // ✅ 중첩라우팅이 필요하지 않은 일반 경로 PATHS
        ...restRoutes.map(({ path }) => {
          return PermittedRouteOption({ path, pathPages });
        }),

        {
          // ⚠️ 중첩라우팅 : SYSTEM_ADMIN.BASE
          ...PermittedRouteOption({ path: SYSTEM_ADMIN.BASE, pathPages }),
          children: [
            { index: true, element: <Wigets.UserManagementPage /> },
            { index: true, element: <Wigets.UserManagementPage /> },
            {
              path: SYSTEM_ADMIN.SEGMENTS.BUILDINGS,
              element: <div children='Buildings' />,
            },
            // {
            //   path: SYSTEM_ADMIN.SEGMENTS.DEVICE,
            //   element: <Wigets.DeviceManagementPage />,
            // },
          ],
        },

        {
          // ⚠️ 중첩라우팅 : NETWORK_MS.BASE
          ...PermittedRouteOption({ path: NETWORK_MS.BASE, pathPages }),
          children: [
            { index: true, element: <Wigets.NMSTopology /> },
            {
              path: NETWORK_MS.SEGMENTS.FLOW_MAP,
              element: <Wigets.NMSFlowMap />,
            },
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

        {
          // ⚠️ 중첩라우팅 : FACILITY_MS
          ...PermittedRouteOption({ path: FACILITY_MS, pathPages }),
          children: [{ index: true, element: <Wigets.FMSDeviceInfo /> }],
        },
      ],
    },
  ];
};
