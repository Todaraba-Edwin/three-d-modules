import clsx from 'clsx';
import { useState, type PropsWithChildren, type ReactNode } from 'react';
import { GNBTooltipPortal } from '../../_reactPortals';

export const NavBody = ({
  children,
  isGnbOpen,
}: PropsWithChildren & {
  isGnbOpen: boolean;
}): ReactNode => {
  return (
    <div
      {...{
        className: 'NavBody',
        children: (
          <ol
            className={clsx('NavOrderedList', {
              'pb-gnb-footer': isGnbOpen,
              'pb-gnb-footer-close': !isGnbOpen,
            })}
          >
            {children}
          </ol>
        ),
      }}
    />
  );
};

export const NavListItem = ({
  ref,
  list: { path, label },
  isMobileMode,
  isActive,
  // isHoverItem,
  is3DmsMode,
  isGnbOpen,
  listItemOnClick,
  ICON,
}: {
  list: PermissionsType;
  ref: React.RefObject<HTMLLIElement>;

  isMobileMode: boolean;
  isActive: boolean;
  is3DmsMode: boolean;
  isGnbOpen: boolean;
  listItemOnClick: () => void;
  ICON: LucideIconType;
}): ReactNode => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const isHoverItem = hoveredItem === path;
  const onMouseEnter = () => setHoveredItem(path);
  const onMouseLeave = () => setHoveredItem(null);
  return (
    <li
      {...{ ref, key: path, onMouseEnter, onMouseLeave }}
      className={clsx('NavListItem', {
        'text-gray-700 hover:text-gray-900': !isActive && !is3DmsMode,
        'text-white hover:text-gray-900': !isActive && is3DmsMode,
        'bg-blue-50 text-blue-700 border-r-4 border-blue-700': isActive,
        'border-l-4': isActive && !isGnbOpen,
        'hover:px-5': !isActive && isGnbOpen,
        'hover:bg-gray-50': !isActive,
      })}
    >
      <button
        disabled={isActive}
        onClick={listItemOnClick}
        className={'NavLitsItemsButton'}
      >
        <ICON className={'NavLitsItemsButtonIcon'} />
        <span className={clsx({ hidden: !isGnbOpen })} children={label} />
      </button>
      {!isMobileMode && (!isGnbOpen || is3DmsMode) && isHoverItem && (
        <GNBTooltipPortal
          {...{
            targetRef: ref,
            weightRight: 194,
            children: label,
          }}
        />
      )}
    </li>
  );
};
