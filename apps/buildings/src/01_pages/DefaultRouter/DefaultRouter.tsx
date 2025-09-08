import { Home } from '@/02_widgets/Home/Home';
import type { RouteObject } from 'react-router-dom';
import { DefaultLayout } from './DefaultLayout';

export const DefaultRouter: RouteObject[] = [
  {
    path: '/',
    element: <DefaultLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'lms', element: <div>LMS 관리</div> },
      { path: 'fms', element: <div>FMS 관리</div> },
      { path: 'system-info', element: <div>시스템 정보</div> },
      { path: 'system-admin', element: <div>관리자 설정</div> },
      { path: 'settings', element: <div>시스템 설정</div> },
      { path: '*', element: <div>찾을 수 없음</div> },
    ],
  },
];
