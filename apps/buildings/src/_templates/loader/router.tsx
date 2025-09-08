import { AuthRouter, CesiumRouter, DefaultRouter, SystemRouter } from '@pages';
import * as RD from 'react-router-dom';
import {
  loginPageLoader,
  protectedRouteLoader,
} from '../../01_pages/authLoaders';
import { ProtectedLayout } from '../../01_pages/ProtectedLayout';

// 로그인 페이지 라우터에 loader를 적용합니다.
// 이미 로그인한 사용자는 메인 페이지로 리다이렉트됩니다.
const authRoutesWithLoader = AuthRouter.map(route => ({
  ...route,
  loader: loginPageLoader,
}));

/**
 * 앱의 라우터 인스턴스.
 * 다른 파일에서 navigate 함수 등을 사용하기 위해 export 합니다.
 */
export const router = RD.createBrowserRouter([
  // 보호된 라우트 그룹
  {
    element: <ProtectedLayout />,
    loader: protectedRouteLoader, // 이 그룹의 모든 자식 라우트가 렌더링되기 전에 실행됩니다.
    children: [
      // 기존의 DefaultRouter, CesiumRouter, SystemRouter를 자식으로 포함합니다.
      ...DefaultRouter,
      ...CesiumRouter,
      ...SystemRouter,
    ],
  },
  // 로그인 라우트 (보호되지 않음)
  ...authRoutesWithLoader,
]);
