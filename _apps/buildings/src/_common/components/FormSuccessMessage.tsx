import { CircleCheckBig } from 'lucide-react';
import { type PropsWithChildren, type ReactNode } from 'react';

export const FormSuccessMessage = ({
  children,
}: PropsWithChildren): ReactNode => {
  return (
    <p
      className='px-3 text-sm text-green-500 flex items-center gap-x-1'
      children={
        <>
          <CircleCheckBig className='w-3 h-3' />
          {children}
        </>
      }
    />
  );
};
