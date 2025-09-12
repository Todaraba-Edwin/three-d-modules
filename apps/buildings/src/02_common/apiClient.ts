import ky from 'ky';
import { router } from '../_templates/loader/router';

const VITE_API_URL = import.meta.env.VITE_API_URL;

/**
 * 전역 ky 클라이언트.
 * 모든 API 요청에 기본 URL, 쿠키 포함 설정을 적용하고,
 * 401 응답을 받으면 강제 로그아웃을 실행합니다.
 */
export const apiClient = ky.create({
  prefixUrl: `${VITE_API_URL}/api`,
  credentials: 'include', // 항상 쿠키를 포함하여 요청
  hooks: {
    afterResponse: [
      async (_request, _options, response) => {
        if (response.status === 401) {
          // 401 Unauthorized 응답을 받으면, 세션이 만료된 것으로 간주합니다.
          // 로그인 페이지로 강제 이동시킵니다.
          router.navigate('/login');
        }
        return response;
      },
    ],
  },
});