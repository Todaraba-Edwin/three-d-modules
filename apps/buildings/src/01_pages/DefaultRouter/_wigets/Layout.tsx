import { utilIsProtectedRoute } from '@/01_pages/authLoaders';
import { useAuthStore } from '@/01_pages/useAuthStore';
import { ButtonLogout } from '@/02_widgets/Auth/ui/ButtonLogout';
import { usePathSegments } from '@monorepo/shared';
import clsx from 'clsx';
import {
  Camera,
  Home,
  Info,
  LogOut,
  Network,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Shield,
} from 'lucide-react';
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
  GNB_ICON: 24,
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

  const { isAdmin } = useAuthStore();

  const menuItems = [
    { icon: Home, label: '대시보드', path: '/' },
    { icon: Network, label: 'LMS 관리', path: '/lms' },
    { icon: Camera, label: 'FMS 관리', path: '/fms' },
    { icon: Info, label: '정보', path: '/system-info' },
    { icon: Settings, label: '설정', path: '/settings' },
  ];

  if (isAdmin) {
    menuItems.splice(1, 0, {
      icon: Shield,
      label: '관리자',
      path: '/system-admin',
    });
  }

  const { GNB_CONTENT, GNB_OPEN_W, GNB_CLOSE_W, GNB_ICON, GNB_PADDING } =
    LayoutSize;

  return (
    <div className='Layout max-h-screen h-screen flex bg-gray-100'>
      <nav
        className={clsx(
          `Layout_GNB`,
          'z-50',
          `grid grid-rows-[auto_1fr]`,
          `flex-shrink-0 bg-white border-r-2 shadow-sm transition-all duration-300`,
          'overflow-hidden',
          {
            [`w-[${GNB_OPEN_W}px]`]: isGnbOpen,
            [`w-[${GNB_CLOSE_W}px]`]: !isGnbOpen,
          }
        )}
      >
        <h2 className='py-4'>
          <img src='/imgs/seoul-university.png' alt='Logo' />
        </h2>
        <div className={clsx('overflow-hidden', 'grid grid-rows-[1fr_auto]')}>
          <ol className={clsx(`w-[${GNB_OPEN_W}px]`, 'overflow-y-auto')}>
            {menuItems.map(list => {
              const isActive = list.path.replace(/\//g, '') === layout;
              console.log('path', list.path, isActive);

              return (
                <li
                  key={list.path}
                  className={clsx(
                    `w-[${GNB_CONTENT}px] p-4 transition-all duration-300`,
                    'hover:px-5 hover:font-semibold',
                    {
                      'text-gray-700 hover:text-gray-900': !isActive,
                      'bg-blue-50 text-blue-700 border-r-4 border-blue-700':
                        isActive,
                      'hover:bg-gray-50': !isActive,
                    }
                  )}
                >
                  <button
                    onClick={utilsNavigate(list.path)}
                    className={clsx(
                      `w-full flex gap-[${GNB_PADDING}px] items-center `
                    )}
                  >
                    <list.icon size={GNB_ICON} className={clsx('font-bold')} />
                    {list.label}
                  </button>
                </li>
              );
            })}
          </ol>

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
        </div>
      </nav>

      {/* 3. 오른쪽 메인 컨텐츠 영역 */}
      <div className='flex-grow grid grid-rows-[auto_1fr]'>
        <div className='bg-white h-12 p-4 flex items-center gap-2'>
          <button onClick={onToggleIsGnbOpen}>
            {isGnbOpen ? <PanelLeftClose /> : <PanelLeftOpen />}
          </button>
          <p className='font-bold text-lg'>
            PRIZM <span className='font-thin text-'>건물관리 시스템</span>
          </p>
        </div>
        <div className='overflow-y-auto'>{children}</div>
      </div>
    </div>
  );
};
