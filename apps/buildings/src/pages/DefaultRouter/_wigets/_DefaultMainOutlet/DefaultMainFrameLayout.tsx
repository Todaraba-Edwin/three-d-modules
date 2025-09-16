import { utilsCheckAuth } from '@/_templates/loader/loaders';
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

import { utilsStoreResets } from '@/_common/zustandStores/utilsStoreResets';
import { isMobile, isMobileSafari } from 'react-device-detect';
import * as RD from 'react-router-dom';
import {
  DefaultPathEnum,
  menuLists,
  noneIcon,
} from '../../../../_common/const/routerPaths';
import { GNBTooltip } from '../_reactPortals/GNBTooltip';

type Props = PropsWithChildren & {
  nickname?: string;
  permissionPaths: any[];
  setIsFocusLogin: Dispatch<React.SetStateAction<boolean>>;
};

const isMobileMode = isMobile || isMobileSafari;

export const DefaultMainFrameLayout = ({
  children,
  nickname,
  permissionPaths,
  setIsFocusLogin,
}: Props): ReactNode => {
  const { layout } = usePathSegments();
  const is3DmsMode = layout.includes(
    DefaultPathEnum.THREE_D_MS.replace('/', '')
  );

  const [isGnbOpen, setIsGnbOpen] = useState(() => {
    return isMobileMode ? false : true;
  });
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const onToggleIsGnbOpen = () => {
    if (isMobileMode) return;
    setIsGnbOpen(prev => !prev);
  };
  const navigate = RD.useNavigate();
  const utilsNavigate = (url: string) => () => {
    const protectedRouteNavigate = async () => {
      const isProtected = Boolean(await utilsCheckAuth());
      if (isProtected) {
        navigate(url);
      } else {
        setIsFocusLogin(true);
      }
    };
    protectedRouteNavigate();
  };

  const menuRefs = useRef(
    permissionPaths.map(() => createRef<HTMLLIElement>())
  );

  return (
    // ✅ 최소규격 : IPadMini(768px) - theme.min-limit
    <div className='Layout max-h-screen h-screen flex bg-gray-100 min-w-min-limit'>
      <nav
        className={clsx(
          `Layout_GNB`,
          'relative',
          'z-50',
          `grid grid-rows-[auto_1fr]`,
          `flex-shrink-0 border-r-3 shadow-sm transition-all duration-300`,
          'overflow-hidden',
          {
            'bg-white': !is3DmsMode,
            'bg-black text-white': is3DmsMode,
            'w-gnb-open': !is3DmsMode && isGnbOpen,
            'w-gnb-close': !isGnbOpen || is3DmsMode,
          }
        )}
      >
        <h2
          className={clsx('py-4', 'cursor-pointer', 'max-w-gnb-open')}
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
              'w-gnb-open',
              {
                'pb-gnb-footer': isGnbOpen,
                'pb-gnb-footer-close': !isGnbOpen,
              },
              'overflow-y-auto'
            )}
          >
            {permissionPaths.map((list, index) => {
              const isActive = list.path.replace(/\//g, '') === layout;
              // ✅ ICON을 찾지 못한 경우에 대한 기본 아이콘 설정
              const ICON =
                menuLists.find(({ path }) => path === list.path)?.icon ||
                noneIcon;

              return (
                <li
                  ref={menuRefs.current[index]}
                  key={list.path}
                  onMouseEnter={() => setHoveredItem(list.path)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={clsx(
                    'h-[60px]',
                    'box-border',
                    'flex items-center',
                    'w-gnb-open p-4 transition-all duration-300 relative',
                    'hover:font-semibold',
                    {
                      'text-gray-700 hover:text-gray-900':
                        !isActive && !is3DmsMode,
                      'text-white hover:text-gray-900': !isActive && is3DmsMode,
                      'bg-blue-50 text-blue-700 border-r-4 border-blue-700':
                        isActive,
                      'border-l-4': isActive && !isGnbOpen,
                      'hover:px-5': !isActive && isGnbOpen,
                      'hover:bg-gray-50': !isActive,
                    }
                  )}
                >
                  <button
                    disabled={isActive}
                    onClick={utilsNavigate(list.path)}
                    className={clsx('w-full flex gap-gnb items-center ')}
                  >
                    <ICON className={clsx('font-bold w-gnb-icon h-gnb-icon')} />
                    <span className={clsx({ hidden: !isGnbOpen })}>
                      {list.label}
                    </span>
                  </button>
                  {!isMobileMode &&
                    (!isGnbOpen || is3DmsMode) &&
                    hoveredItem === list.path && (
                      <GNBTooltip
                        targetRef={menuRefs.current[index]}
                        weightRight={194}
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
            ` absolute bottom-0`,
            'w-gnb-open',

            ' transition-all duration-300',
            {
              'rounded-tl-2xl rounded-tr-2xl': isGnbOpen,
              'h-gnb-footer': isGnbOpen && !is3DmsMode,
              'h-gnb-footer-close': !isGnbOpen,
              'bg-white shadow-[0_-5px_15px_-3px_rgb(0,0,0,0.1),0_-4px_6px_-4px_rgb(0,0,0,0.1)]':
                !is3DmsMode,
              'bg-black shadow-[0_-5px_40px_-3px_rgb(255,255,255,0.1),0_-4px_40px_-4px_rgb(255,255,255,0.1)]':
                is3DmsMode,
            },
            'overflow-hidden',
            'grid grid-rows-[1fr_auto]'
          )}
        >
          {isGnbOpen && !is3DmsMode && (
            <p className='px-4 flex items-center gap-2'>
              <span className='text-xl'>{nickname}</span>
              <span className='font-normal'>님</span>
            </p>
          )}
          <button
            className={clsx('p-4 block', 'w-gnb-content', 'flex gap-gnb')}
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

              // ✅ zustand Store에 대한 초기화 코드
              utilsStoreResets();
            }}
          >
            <LogOut
              className={clsx(
                'text-gray-500 font-bold',
                'w-gnb-icon h-gnb-icon'
              )}
            />
            {isGnbOpen && <p children='로그아웃' />}
          </button>
        </footer>
      </nav>

      {/* 3. 오른쪽 메인 컨텐츠 영역 */}
      {is3DmsMode ? (
        <>{children}</>
      ) : (
        <div className='flex-grow grid grid-rows-[auto_1fr]'>
          <div className='bg-white  h-12 p-4 flex items-center gap-2'>
            {!isMobileMode && (
              <button onClick={onToggleIsGnbOpen}>
                {isGnbOpen ? <PanelLeftClose /> : <PanelLeftOpen />}
              </button>
            )}
            <p className='font-bold text-lg'>
              PRIZM <span className='font-thin text-'>건물관리 시스템</span>
            </p>
          </div>
          <div className='overflow-y-auto p-4'>{children}</div>
        </div>
      )}
    </div>
  );
};
