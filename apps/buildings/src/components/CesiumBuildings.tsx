import {
  CesiumInitBody,
  useCesiumInitNoneGlobe,
  utilsCesiumFlyto,
} from '@monorepo/shared';
import { glbList } from '@monorepo/shared/features/Cesium/05_shared/cesiumConst';
import { type ReactNode } from 'react';

export const CesiumBuildings = (): ReactNode => {
  const { containerRef, viewerRef } = useCesiumInitNoneGlobe({});

  return (
    <CesiumInitBody
      isFullHeight
      containerRef={containerRef}
      isNonBackground
      children={
        <div className='absolute top-4 left-4 z-[99] grid grid-cols-1'>
          {glbList.map(({ name, cameraPosition }) => (
            <button
              key={name}
              className='p-2 text-gray-700 bg-red-100 rounded-sm mb-2'
              onClick={utilsCesiumFlyto({
                viewer: viewerRef,
                name,
                position: cameraPosition,
              })}
              children={name}
            />
          ))}
        </div>
      }
    />
  );
};
