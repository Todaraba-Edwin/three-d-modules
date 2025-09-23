import { type ReactNode } from 'react';
import { styleTailwindClass, styledClass } from '../../05_shared/styleClass';
import type * as Ty from '../../05_shared/types';
const { CESIUM } = styleTailwindClass;
const { INITBODY_OVER_BLUR } = styledClass;

export const CesiumInitBody = ({
  children,
  isFullHeight = false,
  containerRef,
  isNonBackground = false,
}: Ty.CesiumInitBodyProps): ReactNode => {
  const isReady = containerRef.current;

  return (
    <div
      ref={containerRef}
      className={
        isNonBackground
          ? CESIUM.INITBODY_IS_BACKGROUND
          : CESIUM.INITBODY_IS_BACKGROUND
      }
      style={{
        width: '100%',
        height: isFullHeight ? '100vh' : '100%',
      }}
    >
      {isNonBackground && <div className={INITBODY_OVER_BLUR} />}
      {isReady && children}
    </div>
  );
};
