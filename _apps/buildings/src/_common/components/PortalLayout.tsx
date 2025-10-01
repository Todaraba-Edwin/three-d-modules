import { type PropsWithChildren, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

const DimArea = ({ onClosePortal }: onClosePortalType) => {
  /* 배경 투명도, Default GRAY_600 */
  return (
    <div
      className='w-full h-full bg-gray-600 opacity-40'
      {...(onClosePortal ? { onClick: onClosePortal } : {})}
    />
  );
};

const PortalMain = ({ children }: PropsWithChildren) => {
  /* Portal 본문관련 */
  return (
    <main className='absolute w-full max-w-md top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4'>
      <section className='bg-white p-4 rounded-2xl shadow-lg'>
        {children}
      </section>
    </main>
  );
};

export const PortalLayout = ({
  children,
  onClosePortal,
}: PropsWithChildren & onClosePortalType): ReactNode => {
  return createPortal(
    <div className='fixed top-0 left-0 w-full h-full z-50'>
      <DimArea onClosePortal={onClosePortal} />
      <PortalMain children={children} />
    </div>,
    document.body
  );
};
