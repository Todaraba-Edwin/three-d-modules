import { type PropsWithChildren, type ReactNode } from 'react';

export const DefaultMainLayout = ({
  children,
}: PropsWithChildren): ReactNode => {
  return (
    <div
      className='flex h-dvh min-w-viewport bg-gray-100'
      children={children}
    />
  );
};
