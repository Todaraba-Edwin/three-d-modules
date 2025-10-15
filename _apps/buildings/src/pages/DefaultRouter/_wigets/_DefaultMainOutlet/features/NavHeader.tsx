import { AutoFitImage } from '@/_common/components';
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
      className={clsx('max-h-gnb-logo min-h-gnb-logo max-w-gnb-open', {
        'cursor-pointer': !is3DmsMode,
      })}
      {...{
        onClick,
      }}
    >
      <AutoFitImage src='/imgs/seoul-university.png' alt='Logo' />
    </h2>
  );
};
