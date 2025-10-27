import { type ReactNode } from 'react';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import { BM_CONST } from '../../shared';
import { SystemAdminTabLayout } from '../SystemAdminTabLayout';
import { BuildingManagementLayout } from './BuildingManagementLayout';

const MainComponent = (): ReactNode => {
  throw new Error();
  return (
    <SystemAdminTabLayout
      tabTitle={BM_CONST.Tab.title}
      tabDesc={BM_CONST.Tab.desc}
      tabBodyGridType='custom'
      tabBodyChildren={[<BuildingManagementLayout />]}
    />
  );
};

function fallbackRender({ error, resetErrorBoundary }: FallbackProps) {
  const errorMessage =
    error instanceof Error && error.message
      ? error.message
      : '알 수 없는 에러가 발생했습니다.';

  return (
    <div
      role='alert'
      className='flex h-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-red-100 bg-red-50/80 p-4 text-red-700'
    >
      <h4 className='text-lg font-bold'>문제가 발생했습니다.</h4>
      <p className='my-2 text-sm'>{errorMessage}</p>
      <button
        onClick={resetErrorBoundary} // 다시 시도 버튼
        className='mt-2 rounded-md bg-red-600 px-4 py-1.5 text-sm text-white hover:bg-red-700'
      >
        다시 시도
      </button>
    </div>
  );
}

export const BuildingManagementOutlet = (): ReactNode => {
  return (
    <ErrorBoundary fallbackRender={fallbackRender}>
      <MainComponent />
    </ErrorBoundary>
  );
};
