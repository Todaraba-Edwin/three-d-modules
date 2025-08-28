import { router } from '../router';

/**
 * 전역 fetch 유틸리티.
 * 모든 API 요청을 가로채고, 401 응답을 받으면 강제 로그아웃을 실행합니다.
 * @param url - 요청할 URL
 * @param options - fetch 옵션
 * @returns fetch 응답 객체
 */
export const apiClient = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const response = await fetch(url, {
    ...options,
    credentials: 'include', // 항상 쿠키를 포함하여 요청
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (response.status === 401) {
    // 401 Unauthorized 응답을 받으면, 세션이 만료된 것으로 간주합니다.
    // 로그인 페이지로 강제 이동시킵니다.
    router.navigate('/login');

    // 현재 진행중인 나머지 로직들을 중단시키기 위해 에러를 던집니다.
    throw new Error('Session expired');
  }

  return response;
};
