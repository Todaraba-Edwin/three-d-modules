import { type PropsWithChildren, type ReactNode } from 'react';

export const FormErrorMessage = ({
  children,
}: PropsWithChildren): ReactNode => {
  return <span className='px-3 text-sm text-red-300' children={children} />;
};
