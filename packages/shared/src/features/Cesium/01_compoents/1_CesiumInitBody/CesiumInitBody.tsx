import { type ReactNode } from 'react';
import type * as Ty from '../../05_shared/types';

export const CesiumInitBody = ({
  children,
  isFullHeight = false,
  containerRef,
}: Ty.CesiumInitBodyProps): ReactNode => {
  const isReady = containerRef.current;

  return (
    <div
      ref={containerRef}
      className='w-full h-full relative'
      style={{
        height: isFullHeight ? '100vh' : '100%',
      }}
    >
      {isReady && children}
      {children}
    </div>
  );
};
