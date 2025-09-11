import { redirect } from 'react-router-dom';
import { useAuthStore } from '../../02_common/zustandStores/useAuthStore';

const VITE_API_URL = import.meta.env.VITE_API_URL;

/**
 * @description 백엔드에 세션 유효성 검사를 요청하는 loader 함수.
 * @returns 로그인 상태이면 사용자 정보를, 아니면 null을 반환합니다.
 */
export const checkAuth = async (): CheckAuthType => {
  try {
    const response = await fetch(`${VITE_API_URL}/api/auth/validate-session`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // HttpOnly 쿠키 전송을 위해 필수
    });

    if (!response.ok) return null;

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Session validation error:', error);
    return null;
  }
};

/**
 * @description 로그인 페이지를 위한 loader.
 * 로그인(세션) 정보가 유효하면 ProtectedRouter로 리다이렉트.
 */
export const authRouterLoader = async (): RouteLoaderType => {
  const authData = await checkAuth();
  if (authData) return redirect('/');
  return null;
};

/**
 * @description 보호된 페이지들을 위한 loader.
 * 새로고침시마다, 로그인(세션) 정보의 유요성 체크
 * 로그인(세션) 정보가 유효하지 않으면 authRouter로 리다이렉트.
 */
export const protectedRouteLoader = async (): Promise<Response | void> => {
  const authData = await checkAuth();

  if (!authData) return redirect('/login');

  /**
   * @description 전역상태관리(Zustand : 사용자 정보값 설정)
   */

  useAuthStore.getState().setAuth({
    roleCode: authData.roleCode,
    nickname: authData.nickname || '',
    permissions: authData.permissions,
  });
  return;
};

export const utilsProtectedRouteValidateSession =
  async (): Promise<boolean> => {
    const authData = await checkAuth();
    return !!authData;
  };
