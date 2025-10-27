import { ButtonPrimary } from '@monorepo/shared';
import clsx from 'clsx';
import { type PropsWithChildren, type ReactNode } from 'react';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';

const DEFAULT_ERROR = {
  HEADER: '문제가 발생했습니다.',
  MESSAGE: '알 수 없는 에러가 발생했습니다.',
  RETRY_BUTTON: '다시시도',
};

const fallbackRender = ({
  error,
  resetErrorBoundary,
}: FallbackProps): ReactNode => {
  const errorMessage =
    error instanceof Error && error.message
      ? error.message
      : DEFAULT_ERROR.MESSAGE;

  return (
    <div
      role='alert'
      className={clsx(
        'bg-red-50/80 p-4 text-red-700',
        'flex h-full flex-col items-center justify-center',
        'rounded-lg border-2 border-dashed border-red-100'
      )}
    >
      <h4 className='text-lg font-bold' children={DEFAULT_ERROR.HEADER} />
      <p className='my-2 text-sm'>{errorMessage}</p>
      <ButtonPrimary
        onClick={resetErrorBoundary}
        fontSize='sm'
        size='sm'
        variant='tertiary'
        children={DEFAULT_ERROR.RETRY_BUTTON}
      />
    </div>
  );
};

export const ResponseError = ({ children }: PropsWithChildren): ReactNode => {
  return <ErrorBoundary fallbackRender={fallbackRender} children={children} />;
};
