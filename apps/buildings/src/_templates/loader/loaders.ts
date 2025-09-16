import * as API from '@/02_common/apis';
import { useAuthStore } from '@/02_common/zustandStores';
import { redirect } from 'react-router-dom';

/**
 * @description 백엔드에 세션 유효성 검사를 요청하는 loader 함수.
 * @returns 로그인 상태이면 사용자 정보를, 아니면 null을 반환합니다.
 */
export const utilsCheckAuth = async (): utilsCheckAuthType => {
  try {
    const response = await API.authClient.get(
      API.AUTH.SEGMENTS.VALIDATE_SESSION
    );
    const isSuccess = response.ok;
    if (!isSuccess) return null;
    const resultDate: CheckAuthResultType = await response.json();
    return resultDate;
  } catch (error) {
    return API.utilsKyErrorControl(error);
  }
};

/**
 * @description 로그인 페이지를 위한 loader.
 * 로그인(세션) 정보가 유효하면 ProtectedRouter로 리다이렉트.
 */
export const authRouterLoader = async (): RouteLoaderType => {
  const authData = await utilsCheckAuth();
  if (authData) return redirect(API.REDIRECT_PATH.SEGMENTS.ROOT);
};

/**
 * @description 보호된 페이지들을 위한 loader.
 * 새로고침시마다, 로그인(세션) 정보의 유요성 체크
 * 로그인(세션) 정보가 유효하지 않으면 authRouter로 리다이렉트.
 */
export const protectedRouteLoader = async (): Promise<Response | void> => {
  const authData = await utilsCheckAuth();
  if (!authData) return redirect(API.REDIRECT_PATH.SEGMENTS.LOGIN);
  /**
   * @description 전역상태관리(Zustand : 사용자 정보값 설정)
   */
  useAuthStore.getState().setAuth({
    roleCode: authData.roleCode,
    nickname: authData.nickname || '',
    permissions: authData.permissions,
  });
};
