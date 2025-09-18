import clsx from 'clsx';
import { type ReactNode } from 'react';

export const NavHeader = ({
  is3DmsMode,
  onClick,
}: React.ComponentProps<'h2'> & {
  is3DmsMode: boolean;
}): ReactNode => {
  return (
    <h2
      {...{
        className: clsx('NavHeader', { 'cursor-pointer': !is3DmsMode }),
        onClick,
      }}
    >
      <img
        {...{
          src: '/imgs/seoul-university.png',
          alt: 'Logo',
        }}
      />
    </h2>
  );
};
