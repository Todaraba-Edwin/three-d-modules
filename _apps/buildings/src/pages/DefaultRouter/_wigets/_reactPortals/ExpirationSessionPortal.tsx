import { PortalLayout } from '@/_common/components';
import { Button } from '@/_common/components/Button';
import { AlertTriangle } from 'lucide-react';
import { type ReactNode } from 'react';
import * as RD from 'react-router-dom';

export const ExpirationSessionPortal = (): ReactNode => {
  const navigate = RD.useNavigate();
  return (
    <PortalLayout
      children={
        <div className='space-y-4'>
          <div className='flex items-center gap-2'>
            <AlertTriangle className='w-5 h-5 text-red-500' />
            세션 만료
          </div>

          <div className='space-y-3'>
            <div className='bg-red-50 border border-red-200 rounded-lg p-3'>
              <p className='text-sm font-medium text-amber-800'>
                세션이 만료되었습니다. 보안을 위해서 다시 로그인해주세요.
              </p>
            </div>

            <div className='flex flex-col gap-2 '>
              <Button
                onClick={() => {
                  navigate('/login');
                }}
                className='w-full bg-red-500 hover:bg-red-600 text-white'
              >
                확인
              </Button>
            </div>
          </div>
        </div>
      }
    />
  );
};
