import {
  CesiumInitBody,
  useCesiumInitNoneGlobe,
  utilsCesiumFlyto,
  utilsGetListBoundary,
} from '@monorepo/shared';
import {
  utilsSetFloor,
  utilsSetGltfAsync,
} from '@monorepo/shared/features/Cesium/04_utils';
import { glbList } from '@monorepo/shared/features/Cesium/05_shared/cesiumConst';
import * as Cesium from 'cesium';
import { useEffect, type ReactNode } from 'react';

export const Building = (): ReactNode => {
  const boundaryCoordinate = utilsGetListBoundary({ list: glbList });
  const { containerRef, viewerRef } = useCesiumInitNoneGlobe({
    boundaryCoordinate,
  });

  useEffect(() => {
    if (!viewerRef) return;
    // 3️⃣ GLB 객체 추가
    utilsSetGltfAsync({
      viewer: viewerRef,
      glbList: glbList,
    });
    setTimeout(() => {
      utilsSetFloor({
        viewer: viewerRef,
        boundaryCoordinate,
        color: Cesium.Color.DARKGRAY.withAlpha(0.3),
      });
    });
  }, [viewerRef, boundaryCoordinate]);

  return (
    <CesiumInitBody
      isFullHeight
      containerRef={containerRef}
      isNonBackground
      children={
        <div className='absolute top-4 left-4 z-[99] grid grid-cols-1'>
          {glbList.map(({ name, type, cameraPosition }) => (
            <button
              key={name}
              className='p-2 text-gray-700 bg-red-100 rounded-sm mb-2'
              onClick={utilsCesiumFlyto({
                viewer: viewerRef,
                name,
                type,
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
