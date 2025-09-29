import type { PropsWithChildren, ReactNode } from 'react';

export const BMR_Comp: Record<
  'FormLayout' | 'FormHeader' | 'FormBody' | 'FormFooter',
  (_props: PropsWithChildren) => ReactNode
> = {
  FormLayout: ({
    children,
    ...props
  }: PropsWithChildren & React.ComponentProps<'form'>) => {
    return (
      <form
        {...props}
        className='p-4 border-2 rounded-lg min-h-0 grid grid-rows-[auto_auto_1fr] gap-2 h-full'
        {...{ children }}
      />
    );
  },
  FormHeader: ({ children }: PropsWithChildren) => (
    <h2 className='text-lg font-semibold text-gray-900' {...{ children }} />
  ),
  FormBody: ({ children }: PropsWithChildren) => (
    <div
      className='gap-y-2 grid grid-cols-[140px_1fr] min-h-0 h-full items-start overflow-y-auto'
      {...{ children }}
    />
  ),
  FormFooter: ({ children }: PropsWithChildren) => (
    <div
      className='flex space-x-2 justify-center items-end pb-4'
      {...{ children }}
    />
  ),
};
