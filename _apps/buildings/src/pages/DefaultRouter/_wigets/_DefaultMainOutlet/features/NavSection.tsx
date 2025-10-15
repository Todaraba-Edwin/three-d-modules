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
        'relative flex-shrink-0',
        'z-gnb',
        `grid-rows-[auto_1fr] grid`,
        `shadow-xl transition-all duration-300`,
        'overflow-hidden',
        {
          'w-gnb-open': !is3DmsMode && isGnbOpen,
          'w-gnb-close': !isGnbOpen || is3DmsMode,
          'bg-gnb-mode-white-bg text-gnb-mode-white-text': !is3DmsMode,
          'bg-gnb-mode-dark-bg text-gnb-mode-dark-text': is3DmsMode,
        }
      )}
      {...{ children }}
    />
  );
};
