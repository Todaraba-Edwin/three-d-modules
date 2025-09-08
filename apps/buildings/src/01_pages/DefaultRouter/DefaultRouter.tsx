import { Home } from '@/02_widgets/Home/Home';
import type { RouteObject } from 'react-router-dom';
import { DefaultLayout } from './DefaultLayout';
import { menuItemsAdmin } from './_shared/const';

const [SYSTEM_ADMIN, LMS, FMS, SYSTEM_INFO, SETTINGS] = menuItemsAdmin
  .map(list => {
    return { ...list, path: list.path.replace(/\//g, '') };
  })
  .slice(1);

export const DefaultRouter: RouteObject[] = [
  {
    path: '/',
    element: <DefaultLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: LMS.path, element: <div>{LMS.label}</div> },
      { path: FMS.path, element: <div>{FMS.label}</div> },
      { path: SYSTEM_INFO.path, element: <div>{SYSTEM_INFO.label}</div> },
      { path: SYSTEM_ADMIN.path, element: <div>{SYSTEM_ADMIN.label}</div> },
      { path: SETTINGS.path, element: <div>{SETTINGS.label}</div> },
      { path: '*', element: <div>찾을 수 없음</div> },
    ],
  },
];
