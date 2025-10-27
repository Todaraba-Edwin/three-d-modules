import { ButtonPrimary } from '@monorepo/shared';
import { AlertTriangle } from 'lucide-react';
import { type ReactNode } from 'react';
import { useNavigate, useRouteError } from 'react-router-dom';
import { DefaultPathEnum, ROOT_NAME } from '../const';

function isErrorResponse(
  error: unknown
): error is { status: number; statusText: string; data: unknown } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    'statusText' in error
  );
}

// 전역 안전망 (Global Safety Net
// 전체에서 발생하는 예기치 않은 렌더링 에러
export const RouteError = (): ReactNode => {
  const error = useRouteError();

  const navigate = useNavigate();
  console.error(error);

  let errorTitle = '오류가 발생했습니다!';
  let errorMessage =
    '예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';

  if (isErrorResponse(error)) {
    if (error.status === 404) {
      errorTitle = '페이지를 찾을 수 없습니다.';
      errorMessage =
        '요청하신 페이지가 존재하지 않거나, 이동되었을 수 있습니다.';
    } else {
      errorTitle = `오류: ${error.status}`;
      errorMessage = error.statusText;
    }
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4 text-center'>
      <div className='w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl'>
        <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100'>
          <AlertTriangle className='h-8 w-8 text-red-500' />
        </div>
        <h1 className='mb-2 text-2xl font-bold text-gray-800'>{errorTitle}</h1>
        <p className='mb-6 text-gray-600'>{errorMessage}</p>
        <ButtonPrimary
          variant='tertiary'
          onClick={() => navigate(DefaultPathEnum.ROOT, { replace: true })}
          children={`${ROOT_NAME}로 돌아가기`}
        />
      </div>
    </div>
  );
};
