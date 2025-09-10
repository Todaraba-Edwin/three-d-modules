import * as Pages from '@pages';
import * as RD from 'react-router-dom';
import * as Loaders from './loaders';

const authRoutesWithLoader = {
  loader: Loaders.authRouterLoader,
  children: [...Pages.AuthRouter],
};

const protectedWithLoader = {
  element: <Pages.ProtectedLayout />,
  loader: Loaders.protectedRouteLoader,
  children: [...Pages.DefaultRouter(), ...Pages.CesiumRouter],
};

export const router = RD.createBrowserRouter([
  // ⚠️ 접근권한 실패, 로그인 라우트 적용
  authRoutesWithLoader,
  // ✅ 접근권한 확인, 하위 라우트에 접근
  protectedWithLoader,
]);
