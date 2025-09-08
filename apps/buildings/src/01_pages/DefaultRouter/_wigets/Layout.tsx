import { utilIsProtectedRoute } from '@/01_pages/authLoaders';
import { ButtonLogout } from '@/02_widgets/Auth/ui/ButtonLogout';
import { usePathSegments } from '@monorepo/shared';
import clsx from 'clsx';
import { Home, Info, LogOut, Network, Zap } from 'lucide-react';
import {
  useState,
  type Dispatch,
  type PropsWithChildren,
  type ReactNode,
} from 'react';
import * as RD from 'react-router-dom';

type Props = PropsWithChildren & {
  setIsFocusLogin: Dispatch<React.SetStateAction<boolean>>;
};

const LayoutSize = {
  GNB_OPEN_W: 250,
  GNB_PADDING: 16,
  GNB_ICON: 16,
  get GNB_CLOSE_W() {
    return this.GNB_ICON + this.GNB_PADDING * 2; // 48
  },
  get GNB_CONTENT() {
    return this.GNB_OPEN_W - this.GNB_PADDING * 2; // 218
  },
  get GNB_REST() {
    return this.GNB_CONTENT - this.GNB_ICON - this.GNB_PADDING; // 186
  },
};

export const Layout = ({ children, setIsFocusLogin }: Props): ReactNode => {
  const { layout } = usePathSegments();
  const [isGnbOpen, setIsGnbOpen] = useState(true);
  const onToggleIsGnbOpen = () => setIsGnbOpen(prev => !prev);
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
    // 1. flexbox를 사용하여 전체 레이아웃을 구성하고, 화면 전체 높이를 차지하도록 설정
    <div className='Layout flex h-screen bg-gray-100'>
      {/* 2. 왼쪽 GNB(네비게이션 바) 영역 */}
      <nav
        className={clsx(
          `Layout_GNB`,
          `flex-shrink-0 bg-white shadow-md transition-all duration-300`,
          'overflow-hidden',
          {
            [`w-[${LayoutSize.GNB_OPEN_W}px]`]: isGnbOpen,
            [`w-[${LayoutSize.GNB_CLOSE_W}px]`]: !isGnbOpen,
          }
        )}
      >
        <div className={clsx('p-4', `w-[${LayoutSize.GNB_CONTENT}px]`)}>
          {/* GNB 컨텐츠는 여기에 위치합니다. isGnbOpen 상태에 따라 다른 내용을 보여줄 수 있습니다. */}
          <h2 className='text-xl font-bold'>메뉴</h2>
        </div>
        <div className={clsx('p-4', `w-[${LayoutSize.GNB_CONTENT}px]`)}>
          <ol>
            {[
              {
                pageName: '대시보드',
                url: '/',
              },
              {
                pageName: 'LMS 관리',
                url: '/lms',
              },
              {
                pageName: 'FMS 관리',
                url: '/fms',
              },
              {
                pageName: '시스템 설정',
                url: '/system-info',
              },
              {
                pageName: '관리자 설정',
                url: '/system-admin',
              },
              {
                pageName: '설정',
                url: '/setting',
              },
            ].map(({ pageName, url }) => (
              <li
                key={pageName}
                className={
                  isCurrentSegment(pageName === 'home' ? '' : pageName) +
                  ' cursor-pointer' +
                  ' flex gap-4'
                }
                onClick={utilsNavigate(url)}
                children={
                  <>
                    {pageName === '대시보드' && (
                      <Home
                        className={clsx(
                          'text-gray-500 font-bold',
                          `w-[${LayoutSize.GNB_ICON}px] h-[${LayoutSize.GNB_ICON}px]`
                        )}
                      />
                    )}
                     {pageName === 'LMS 관리' && (
                      <Zap
                        className={clsx(
                          'text-gray-500 font-bold',
                          `w-[${LayoutSize.GNB_ICON}px] h-[${LayoutSize.GNB_ICON}px]`
                        )}
                      />
                    )}
                     {pageName === 'FMS 관리' && (
                      <Network
                        className={clsx(
                          'text-gray-500 font-bold',
                          `w-[${LayoutSize.GNB_ICON}px] h-[${LayoutSize.GNB_ICON}px]`
                        )}
                      />
                    )}
                     {pageName === '시스템 설정' && (
                      <Info
                        className={clsx(
                          'text-gray-500 font-bold',
                          `w-[${LayoutSize.GNB_ICON}px] h-[${LayoutSize.GNB_ICON}px]`
                        )}
                      />
                    )}
                     {pageName === 'home' && (
                      <Home
                        className={clsx(
                          'text-gray-500 font-bold',
                          `w-[${LayoutSize.GNB_ICON}px] h-[${LayoutSize.GNB_ICON}px]`
                        )}
                      />
                    )}
                    {pageName}
                  </>
                }
              />
            ))}
          </ol>
        </div>
        <div
          className={clsx(
            'p-4',
            `w-[${LayoutSize.GNB_CONTENT}px]`,
            `flex gap-[${LayoutSize.GNB_PADDING}px]`
          )}
        >
          <LogOut
            className={clsx(
              'text-gray-500 font-bold',
              `w-[${LayoutSize.GNB_ICON}px] h-[${LayoutSize.GNB_ICON}px]`
            )}
          />
          <ButtonLogout />
        </div>
      </nav>

      {/* 3. 오른쪽 메인 컨텐츠 영역 */}
      <div className='flex-grow p-6'>
        {/* 4. GNB 너비를 제어하는 토글 버튼 */}
        <button
          onClick={onToggleIsGnbOpen}
          className='mb-4 rounded bg-indigo-600 px-4 py-2 font-semibold text-white shadow-sm hover:bg-indigo-700'
        >
          GNB 너비 변경
        </button>

        {/* children을 통해 렌더링될 페이지 컨텐츠 */}
        <div className='rounded-lg bg-white p-4 shadow'>{children}</div>
      </div>
    </div>
  );
};
