import { utilIsProtectedRoute } from '@/_templates/loader/loaders';
import { usePathSegments } from '@monorepo/shared';
import clsx from 'clsx';
import { LogOut, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import {
  createRef,
  useRef,
  useState,
  type Dispatch,
  type PropsWithChildren,
  type ReactNode,
} from 'react';
const VITE_API_URL = import.meta.env.VITE_API_URL;

import * as RD from 'react-router-dom';
import { LayoutSize, type menuItemsType } from '../_shared/const';
import { GNBTooltip } from './GNBTooltip';

type Props = PropsWithChildren & {
  nickname?: string;
  gmbMenuItems: menuItemsType[];
  setIsFocusLogin: Dispatch<React.SetStateAction<boolean>>;
};

export const Layout = ({
  children,
  nickname,
  gmbMenuItems,
  setIsFocusLogin,
}: Props): ReactNode => {
  const { layout } = usePathSegments();
  const [isGnbOpen, setIsGnbOpen] = useState(true);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
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

  const {
    GNB_CONTENT,
    GNB_OPEN_W,
    GNB_CLOSE_W,
    GNB_ICON,
    GNB_PADDING,
    GNB_REST,
    GNB_FOOTER,
    GNB_FOOTER_CLOSE,
  } = LayoutSize;

  const menuRefs = useRef(gmbMenuItems.map(() => createRef<HTMLLIElement>()));

  return (
    <div className='Layout max-h-screen h-screen flex bg-gray-100'>
      <nav
        className={clsx(
          `Layout_GNB`,
          'relative',
          'z-50',
          `grid grid-rows-[auto_1fr]`,
          `flex-shrink-0 bg-white border-r-3 shadow-sm transition-all duration-300`,
          'overflow-hidden',
          {
            [`w-[${GNB_OPEN_W}px]`]: isGnbOpen,
            [`w-[${GNB_CLOSE_W}px]`]: !isGnbOpen,
          }
        )}
      >
        <h2
          className={clsx('py-4 cursor-pointer', `max-w-[${GNB_OPEN_W}px]`)}
          onClick={onToggleIsGnbOpen}
        >
          <img src='/imgs/seoul-university.png' alt='Logo' />
        </h2>
        <div
          className={clsx(
            'overflow-x-hidden',
            '[scrollbar-width:none]', // Firefox
            '[&::-webkit-scrollbar]:hidden' // Webkit
          )}
        >
          <ol
            className={clsx(
              `w-[${GNB_OPEN_W}px]`,
              {
                [`pb-[${GNB_FOOTER}px]`]: isGnbOpen,
                [`pb-[${GNB_FOOTER_CLOSE}px]`]: !isGnbOpen,
              },
              'overflow-y-auto'
            )}
          >
            {gmbMenuItems.map((list, index) => {
              const isActive = list.path.replace(/\//g, '') === layout;

              return (
                <li
                  ref={menuRefs.current[index]}
                  key={list.path}
                  onMouseEnter={() => setHoveredItem(list.path)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={clsx(
                    `w-[${GNB_CONTENT}px] p-4 transition-all duration-300 relative`,
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
                    <span className={clsx({ hidden: !isGnbOpen })}>
                      {list.label}
                    </span>
                  </button>
                  {!isGnbOpen && hoveredItem === list.path && (
                    <GNBTooltip
                      targetRef={menuRefs.current[index]}
                      weightRight={GNB_REST + GNB_PADDING}
                    >
                      {list.label}
                    </GNBTooltip>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
        <footer
          className={clsx(
            `bg-white absolute bottom-0`,
            'shadow-[0_-5px_15px_-3px_rgb(0,0,0,0.1),0_-4px_6px_-4px_rgb(0,0,0,0.1)]',
            `w-[${GNB_OPEN_W}px]`,
            {
              [`h-[${GNB_FOOTER}px]`]: isGnbOpen,
              [`h-[${GNB_FOOTER_CLOSE}px]`]: !isGnbOpen,
            },
            'overflow-hidden',
            'grid grid-rows-[1fr_auto]'
          )}
        >
          {isGnbOpen && (
            <p className='px-4 flex items-center gap-2'>
              <span className='text-xl'>{nickname}</span>
              <span className='font-normal'>님</span>
            </p>
          )}
          <div
            className={clsx(
              'p-4',
              `w-[${LayoutSize.GNB_CONTENT}px]`,
              `flex gap-[${LayoutSize.GNB_PADDING}px]`
            )}
            onClick={() => {
              fetch(`${VITE_API_URL}/api/auth/logout`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                credentials: 'include', // 쿠키 자동 전송
              })
                .then(async response => {
                  const data = await response.json();
                  if (response.ok) {
                    return data;
                  } else {
                    throw data;
                  }
                })
                .then(() => {
                  navigate('/login');
                })
                .catch(errorDate => {
                  console.error(errorDate.message);
                  navigate('/login');
                });
            }}
          >
            <LogOut
              className={clsx(
                'text-gray-500 font-bold',
                `w-[${LayoutSize.GNB_ICON}px] h-[${LayoutSize.GNB_ICON}px]`
              )}
            />
            <button children='로그아웃' />
          </div>
        </footer>
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
