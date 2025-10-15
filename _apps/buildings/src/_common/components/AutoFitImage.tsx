import { type ReactNode } from 'react';

type Props = React.ComponentProps<'img'>;

export const AutoFitImage = (Props: Props): ReactNode => {
  return (
    <img className='h-full w-full object-cover object-center' {...Props} />
  );
};
