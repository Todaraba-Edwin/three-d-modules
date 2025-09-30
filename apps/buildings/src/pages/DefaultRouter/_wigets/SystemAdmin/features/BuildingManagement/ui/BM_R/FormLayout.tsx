import { type ReactNode } from 'react';

export const FormLayout = ({
  children,
  ...props
}: ReactPropsWithChildrenAndTags<'form'>): ReactNode => {
  return (
    <form
      {...props}
      className='p-4 border-2 rounded-lg min-h-0 grid grid-rows-[auto_auto_1fr] gap-2 h-full'
      {...{ children }}
    />
  );
};
