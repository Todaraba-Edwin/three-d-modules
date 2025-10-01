import { router } from '@/_templates';
import ky, { HTTPError, type Options } from 'ky';

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

/**
 * 전역 ky 파일 업로드 함수
 */
export async function uploadFile(
  file: File,
  saveFolder?: 'temporary' | 'images',
): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append('file', file);

  const endpoint = saveFolder
    ? `files/upload?saveFolder=${saveFolder}`
    : 'files/upload';

  return apiClient
    .post(endpoint, {
      body: formData,
      // ⚠️ Content-Type은 ky가 자동으로 multipart/form-data로 설정함
    })
    .json<{ url: string }>(); // 서버에서 반환하는 JSON 구조에 맞게 타입 지정
}

/**
 * 전역 ky 클라이언트에 대한 catch Error 객체 제어
 */

export const utilsKyErrorControl = async (
  errorType: HTTPError | unknown,
): Promise<null> => {
  const isHTTPError = errorType instanceof HTTPError;
  if (isHTTPError) {
    const errorData = await errorType.response.json();
    console.error('Session validation error:', errorData.message);
  } else {
    console.error('Session validation error:', errorType);
  }
  return null;
};
