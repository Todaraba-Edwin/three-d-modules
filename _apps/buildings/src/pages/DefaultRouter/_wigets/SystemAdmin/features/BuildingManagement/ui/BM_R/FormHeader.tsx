import { type PropsWithChildren, type ReactNode } from 'react';

export const FormHeader = ({ children }: PropsWithChildren): ReactNode => {
  return (
    <h2 className='text-lg font-semibold text-gray-900' {...{ children }} />
  );
};
