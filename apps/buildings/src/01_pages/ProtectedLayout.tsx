import type { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';

/**
 * 보호된 페이지들을 위한 공통 레이아웃 컴포넌트.
 * 현재는 자식 라우트를 렌더링하는 역할만 하지만,
 * 추후 모든 보호된 페이지에 공통으로 들어갈 UI(네비게이션 바 등)를 추가할 수 있습니다.
 */
export const ProtectedLayout = (): ReactNode => {
  return <Outlet />;
};
