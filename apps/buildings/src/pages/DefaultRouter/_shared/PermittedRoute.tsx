import { DefaultPathEnum } from '@/_common/const';
import { useAuthStore } from '@/_common/zustandStores';
import { useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

const { ROOT } = DefaultPathEnum;

export const PermittedRoute = ({
  validationPath,
  pathPages,
}: {
  validationPath: string;
  pathPages: Record<string, ReactNode>;
}): ReactNode => {
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
      navigate(ROOT, { replace: true });
    }
  }, [findPath, navigate]);

  if (!findPath || !pathPages[findPath.path])
    return <div>{findPath ? findPath.label : ''} 페이지 개발 중...</div>;
  return pathPages[findPath.path];
};
