import { type PropsWithChildren, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

export const LoginActivityDetectedPortal = ({
  children,
}: PropsWithChildren): ReactNode => {
  return createPortal(
    <div className='fixed top-0 left-0 w-full h-full z-50'>
      // 배경 투명도, Default GRAY_600
      <div
        className='w-full h-full bg-gray-600 opacity-40'
        onClick={() => {}}
      />
      // Portal 본문관련
      <div className='absolute w-full max-w-md top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4'>
        <div className='bg-white p-4 rounded-2xl shadow-lg'>
          LoginActivityDetectedPortal
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};
