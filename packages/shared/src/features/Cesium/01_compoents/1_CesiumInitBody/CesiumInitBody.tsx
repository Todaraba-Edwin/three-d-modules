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
      style={{
        position: 'relative',
        width: '100%',
        height: isFullHeight ? '100vh' : '100%',
      }}
    >
      {isReady && children}
    </div>
  );
};
