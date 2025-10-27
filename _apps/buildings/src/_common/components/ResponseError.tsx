import { ButtonPrimary } from '@monorepo/shared';
import clsx from 'clsx';
import { type PropsWithChildren, type ReactNode } from 'react';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';

const fallbackRender = ({
  error,
  resetErrorBoundary,
}: FallbackProps): ReactNode => {
  const errorMessage =
    error instanceof Error && error.message
      ? error.message
      : '알 수 없는 에러가 발생했습니다.';

  return (
    <div
      role='alert'
      className={clsx(
        'bg-red-50/80 p-4 text-red-700',
        'flex h-full flex-col items-center justify-center',
        'rounded-lg border-2 border-dashed border-red-100'
      )}
    >
      <h4 className='text-lg font-bold'>문제가 발생했습니다.</h4>
      <p className='my-2 text-sm'>{errorMessage}</p>
      <ButtonPrimary
        onClick={resetErrorBoundary} // 다시 시도 버튼
        fontSize='sm'
        size='sm'
        variant='tertiary'
        children='다시시도'
      />
    </div>
  );
};

export const ResponseError = ({ children }: PropsWithChildren): ReactNode => {
  return <ErrorBoundary fallbackRender={fallbackRender} children={children} />;
};
