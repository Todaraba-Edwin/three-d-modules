import clsx from 'clsx';
import { type PropsWithChildren, type ReactNode } from 'react';

export const NavSection = ({
  children,
  is3DmsMode,
  isGnbOpen,
}: PropsWithChildren & {
  is3DmsMode: boolean;
  isGnbOpen: boolean;
}): ReactNode => {
  return (
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
      children={children}
    />
  );
};
