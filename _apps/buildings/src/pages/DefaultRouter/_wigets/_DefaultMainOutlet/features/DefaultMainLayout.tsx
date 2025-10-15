import { type PropsWithChildren, type ReactNode } from 'react';

export const DefaultMainLayout = ({
  children,
}: PropsWithChildren): ReactNode => {
  return (
    <div className='bg-root-bg flex h-dvh min-w-viewport' {...{ children }} />
  );
};
