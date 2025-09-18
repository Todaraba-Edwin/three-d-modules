import { DefaultPathEnum, menuLists, noneIcon } from '@/_common/const';
import { utilsStoreResets } from '@/_common/zustandStores';
import { utilsCheckAuth } from '@/_templates';
import { usePathSegments } from '@monorepo/shared';
import clsx from 'clsx';
import { LogOut, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { createRef, useRef, useState, type ReactNode } from 'react';
import { isMobile, isMobileSafari } from 'react-device-detect';
import * as RD from 'react-router-dom';
import {
  DefaultMainLayout,
  NavBody,
  NavHeader,
  NavListItem,
  NavSection,
} from './features';
const VITE_API_URL = import.meta.env.VITE_API_URL;
const isMobileMode = isMobile || isMobileSafari;

export const DefaultMainOutletLayout = ({
  children,
  nickname,
  permissionPaths,
  setIsFocusLogin,
}: DefaultMainOutletLayoutProps): ReactNode => {
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
    <DefaultMainLayout>
      <NavSection {...{ is3DmsMode, isGnbOpen }}>
        <NavHeader {...{ is3DmsMode }} />
        <NavBody {...{ isGnbOpen }}>
          {permissionPaths.map((list: PermissionsType, idx: number) => {
            const isActive = list.path.replace(/\//g, '') === layout;

            const ICON =
              menuLists.find(({ path }) => path === list.path)?.icon ||
              noneIcon; // ✅ ICON Default

            return (
              <NavListItem
                {...{
                  ref: menuRefs.current[idx],
                  list,
                  isMobileMode,
                  isActive,
                  isHoverItem: hoveredItem === list.path,
                  is3DmsMode,
                  isGnbOpen,
                  ICON,
                  onMouseEnter: () => setHoveredItem(list.path),
                  onMouseLeave: () => setHoveredItem(null),
                  listItemOnClick: utilsNavigate(list.path),
                }}
              />
            );
          })}
        </NavBody>
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
      </NavSection>

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
    </DefaultMainLayout>
  );
};
