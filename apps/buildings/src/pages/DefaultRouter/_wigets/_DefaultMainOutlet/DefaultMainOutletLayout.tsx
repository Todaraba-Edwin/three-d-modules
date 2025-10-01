import { DefaultPathEnum, menuLists, noneIcon } from '@/_common/const';
import { utilsCheckAuth } from '@/_templates';
import { usePathSegments } from '@monorepo/shared';
import { createRef, useRef, useState, type ReactNode } from 'react';
import { isMobile, isMobileSafari } from 'react-device-detect';
import * as RD from 'react-router-dom';
import * as Feat from './features';
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
    <Feat.DefaultMainLayout>
      {/* 1. 왼쪽 네비게이션 영역 */}
      <Feat.NavSection {...{ is3DmsMode, isGnbOpen }}>
        <Feat.NavHeader {...{ is3DmsMode, onClick: onToggleIsGnbOpen }} />
        <Feat.NavBody {...{ isGnbOpen }}>
          {permissionPaths.map((list: PermissionsType, idx: number) => {
            const isActive = list.path.replace(/\//g, '') === layout;

            const ICON =
              menuLists.find(({ path }) => path === list.path)?.icon ||
              noneIcon; // ✅ ICON Default

            return (
              <Feat.NavListItem
                key={list.id}
                {...{
                  ref: menuRefs.current[idx],
                  list,
                  isMobileMode,
                  isActive,
                  is3DmsMode,
                  isGnbOpen,
                  ICON,
                  listItemOnClick: utilsNavigate(list.path),
                }}
              />
            );
          })}
        </Feat.NavBody>
        <Feat.NavFooter
          {...{
            is3DmsMode,
            isGnbOpen,
            nickname,
          }}
        />
      </Feat.NavSection>

      {/* 2. 오른쪽 메인 컨텐츠 영역 */}
      <Feat.OutletSection
        {...{
          is3DmsMode,
          isMobileMode,
          isGnbOpen,
          onToggleIsGnbOpen,
          children,
        }}
      />
    </Feat.DefaultMainLayout>
  );
};
