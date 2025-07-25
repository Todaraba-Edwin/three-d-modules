import { type ReactNode } from 'react';
import {
  useCesiumInitNoneGlobe,
  utilsGetListBoundary,
} from '../../02_exportEntitles';
import { utilsCesiumFlyto } from '../../02_exportEntitles/utilsCesiumFlyto';
import { utilsSetGltfAsync } from '../../04_utils';
import { glbList } from '../../05_shared/cesiumConst';
import { CesiumInitBody } from '../1_CesiumInitBody/CesiumInitBody';

export const CesiumBuilding = (): ReactNode => {
  // 1️⃣ glbList 에 대한 영역및 중심좌표 얻어오기
  const boundaryCoordinate = utilsGetListBoundary({ list: glbList });

  // 2️⃣ Cesium Init 설정
  const { containerRef, viewerRef } = useCesiumInitNoneGlobe({
    initCameraHeight: 200,
    boundaryCoordinate,
  });

  // 3️⃣ GLB 객체 추가
  utilsSetGltfAsync({
    viewer: viewerRef,
    glbList: glbList,
  });

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
