import { Button } from '@/02_widgets/Auth/ui/Button';
import { usePathSegments } from '@monorepo/shared';
import { AlertTriangle } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import * as RD from 'react-router-dom';
import { utilIsProtectedRoute } from '../authLoaders';

export const DefaultLayout = (): ReactNode => {
  const { layout } = usePathSegments();
  const [isFocusLogin, setIsFocusLogin] = useState<boolean>(false);
  const navigate = RD.useNavigate();
  const utilsNavigate = (url: string) => () => {
    const protectedRouteNavigate = async () => {
      const isProtected = await utilIsProtectedRoute();
      if (isProtected) {
        navigate(url);
      } else {
        setIsFocusLogin(true);
      }
    };
    protectedRouteNavigate();
  };

  const isCurrentSegment = (targetSegment: string) => {
    return targetSegment === layout ? 'text-red-200' : '';
  };
  return (
    <div className='DefaultLayout'>
      <ol>
        {[
          {
            pageName: 'home',
            url: '/',
          },
          {
            pageName: 'building',
            url: '/building',
          },
          {
            pageName: 'system',
            url: '/system',
          },
          {
            pageName: 'login',
            url: '/login',
          },
        ].map(({ pageName, url }) => (
          <li
            key={pageName}
            className={
              isCurrentSegment(pageName === 'home' ? '' : pageName) +
              ' cursor-pointer'
            }
            onClick={utilsNavigate(url)}
            children={pageName}
          />
        ))}
      </ol>
      <RD.Outlet />
      {isFocusLogin && (
        <div className='fixed top-0 left-0 w-full h-full'>
          <div className='w-full h-full bg-gray-600 opacity-40' />
          <div className='absolute w-full max-w-md top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4'>
            <div className=' bg-white p-4  rounded-2xl'>
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
