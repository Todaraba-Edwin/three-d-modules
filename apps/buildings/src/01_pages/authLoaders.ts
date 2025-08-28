import { redirect } from 'react-router-dom';

const VITE_API_URL = import.meta.env.VITE_API_URL;

/**
 * @description 백엔드에 세션 유효성 검사를 요청하는 loader 함수.
 * @returns 로그인 상태이면 사용자 정보를, 아니면 null을 반환합니다.
 */

type CheckAuthType = Promise<
  | {
      message: string;
      username: string;
    }
  | Response
  | null
>;

type RouteLoaderType = Promise<Response | null>;

export const checkAuth = async (): CheckAuthType => {
  try {
    const response = await fetch(`${VITE_API_URL}/api/auth/validate-session`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // HttpOnly 쿠키 전송을 위해 필수
    });

    if (!response.ok) {
      // 401 Unauthorized 등 응답이 정상이 아닐 경우
      return null;
    }

    const data = await response.json();
    return data; // { message, username }
  } catch (error) {
    console.error('Session validation error:', error);
    return null;
  }
};

/**
 * @description 로그인 페이지를 위한 loader.
 * 이미 로그인된 상태라면 메인 페이지로 리다이렉트합니다.
 */
export const loginPageLoader = async (): RouteLoaderType => {
  const authData = await checkAuth();

  if (authData) {
    return redirect('/');
  }
  return null;
};

/**
 * @description 보호된 페이지들을 위한 loader.
 * 로그인되지 않은 상태라면 로그인 페이지로 리다이렉트합니다.
 */
export const protectedRouteLoader = async (): Promise<Response | null> => {
  const authData = await checkAuth();
  if (!authData) {
    return redirect('/login');
  }
  return null; // 혹은 authData를 반환하여 하위 컴포넌트에서 사용
};

export const utilIsProtectedRoute = async (): CheckAuthType => {
  return await checkAuth();
};
