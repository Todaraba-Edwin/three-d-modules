import ky, { type Options } from 'ky';

const VITE_API_URL = import.meta.env.VITE_API_URL;
const kyOptions: Options = {
  prefixUrl: `${VITE_API_URL}/api`,
  credentials: 'include', // 항상 쿠키를 포함하여 요청
};

/**
 * 전역 ky 클라이언트.
 * 모든 API 요청에 기본 URL, 쿠키 포함 설정을 적용하고,
 * 401 응답을 받으면 강제 로그아웃을 실행합니다.
 */

export const authClient = ky.create({
  ...kyOptions,
});

export const apiClient = ky.create({
  ...kyOptions,
});
