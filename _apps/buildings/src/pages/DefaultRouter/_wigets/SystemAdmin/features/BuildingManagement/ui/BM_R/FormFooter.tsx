import { type PropsWithChildren, type ReactNode } from 'react';

export const FormFooter = ({ children }: PropsWithChildren): ReactNode => {
  return (
    <div
      className='flex space-x-2 justify-center items-end pb-4'
      {...{ children }}
    />
  );
};
