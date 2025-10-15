import { DefaultPathEnum, menuLists, noneIcon } from '@/_common/const';
import {
  useSystemAdminAddRoleStore,
  useSystemAdminAddUserStore,
  useSyStemAdminSelectedRole,
} from '@/_common/zustandStores';
import { utilsCheckAuth } from '@/_templates';
import { usePathSegments } from '@_shared';
import { createRef, useRef, useState, type ReactNode } from 'react';
import { isMobile, isMobileSafari } from 'react-device-detect';
import * as RD from 'react-router-dom';
import * as Feat from './features';
const isMobileMode = isMobile || isMobileSafari;

export const DefaultMainOutletLayout = ({
  children,
  nickname,
  permissionPaths,
  setIsExpirationSession,
}: DefaultMainOutletLayoutProps): ReactNode => {
  // #_001 GNB를 열고 닫는 상태 및 제어함수 와 개별 li태그의 ref함수 선언
  const [isGnbOpen, setIsGnbOpen] = useState(() => {
    return isMobileMode ? false : true;
  });
  const onToggleIsGnbOpen = () => {
    if (isMobileMode) return;
    setIsGnbOpen(prev => !prev);
  };

  const menuRefs = useRef(
    permissionPaths.map(() => createRef<HTMLLIElement>())
  );

  // #_002 is3DmsMode 를 판별하기 위한 진위값 산출
  const { layout } = usePathSegments();
  const is3DmsMode = layout.includes(
    DefaultPathEnum.THREE_D_MS.replace('/', '')
  );

  // #_003 관리자 페이지 진입시, store 가드 치원에서 초기화
  const {
    isShowAddRoleNode,
    isEditModeRole,
    reset: resetRole,
  } = useSystemAdminAddRoleStore();

  const {
    isShowAddUserNode,
    isEditModeUser,
    reset: resetUser,
  } = useSystemAdminAddUserStore();

  const { selectedRoleId, reset: resetSelectedRole } =
    useSyStemAdminSelectedRole();

  // #_004 라우터 경로에서 클릭 이벤트 발생시, 경로 이동 함수
  const navigate = RD.useNavigate();
  const utilsNavigate = (url: string) => () => {
    if (isShowAddRoleNode || isEditModeRole) {
      resetRole();
    }

    if (isShowAddUserNode || isEditModeUser) {
      resetUser();
    }

    if (selectedRoleId) {
      resetSelectedRole();
    }

    const protectedRouteNavigate = async () => {
      const isProtected = Boolean(await utilsCheckAuth());
      if (isProtected) {
        navigate(url);
      } else {
        setIsExpirationSession(true);
      }
    };
    protectedRouteNavigate();
  };

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
