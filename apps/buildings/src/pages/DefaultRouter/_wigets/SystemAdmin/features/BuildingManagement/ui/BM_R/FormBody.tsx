import { type PropsWithChildren, type ReactNode } from 'react';

export const FormBody = ({ children }: PropsWithChildren): ReactNode => {
  return (
    <div
      className='gap-y-2 grid grid-cols-[140px_1fr] min-h-0 h-full items-start overflow-y-auto py-'
      {...{ children }}
    />
  );
};
