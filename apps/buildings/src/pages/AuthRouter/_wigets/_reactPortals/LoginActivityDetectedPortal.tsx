import { Button, LoadingSpin, PortalLayout } from '@/_common/components';
import { AlertTriangle } from 'lucide-react';
import { type FormEvent, type PropsWithChildren, type ReactNode } from 'react';

const PORTAL_INFO = {
  TITLE: '로그인 이력 감지',
  DESC: '현재 다른 위치에서 이 계정으로 접속 중입니다. 계속하시면 기존 접속은 종료됩니다.',
  IS_LOADING: '현재 PC에서 로그인 중...',
  NONE_LOADING: '현재 PC에서 로그인',
};

export const LoginActivityDetectedPortal = ({
  isLoading,
  onForceSubmit,
  onClosePortal,
}: PropsWithChildren & {
  isLoading: boolean;
  onForceSubmit: (_e: FormEvent) => void;
  onClosePortal: () => void;
}): ReactNode => {
  return (
    <PortalLayout onClosePortal={onClosePortal}>
      <div className='space-y-4'>
        <div className='flex items-center gap-2'>
          <AlertTriangle className='w-5 h-5 text-amber-500' />
          {PORTAL_INFO.TITLE}
        </div>

        <div className='space-y-3'>
          <div className='bg-amber-50 border border-amber-200 rounded-lg p-3'>
            <p className='text-sm font-medium text-amber-800'>
              {PORTAL_INFO.DESC}
            </p>
          </div>

          <div className='flex flex-col gap-2 '>
            <Button
              onClick={onForceSubmit}
              className='flex-1 bg-amber-500 hover:bg-amber-600  text-white'
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <LoadingSpin />
                  {PORTAL_INFO.IS_LOADING}
                </>
              ) : (
                PORTAL_INFO.NONE_LOADING
              )}
            </Button>
            <Button
              variant='outline'
              onClick={onClosePortal}
              className='flex-1'
            >
              취소
            </Button>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};
