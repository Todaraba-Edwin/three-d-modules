import {
  CesiumInitBody,
  InitPosition,
  useCesiumInitNoneGlobe,
  useSetGltfAsync,
  utilsAddLines,
  utilsCesiumFlyto,
  utilsGetListBoundary,
} from '@monorepo/shared';
import { glbList } from '@monorepo/shared/features/Cesium/05_shared/cesiumConst';
import { useEffect, type ReactNode } from 'react';

export const Building = (): ReactNode => {
  const boundaryCoordinate = utilsGetListBoundary({ list: glbList });
  const { containerRef, viewerRef } = useCesiumInitNoneGlobe({
    boundaryCoordinate,
  });

  useSetGltfAsync({
    viewer: viewerRef,
    glbList,
    boundaryCoordinate,
    isFloor: true,
  });

  useEffect(() => {
    setTimeout(() => {
      if (!viewerRef) return;

      fetch('/mock/lineList.json')
        .then(res => res.json())
        .then(({ data }) => {
          if (data.length === 0) return;
          // TODO: 반환되는 선로 DTO에 대한 정책 수립 필요
          //eslint-disable-next-line
          data.forEach(({ coordinates }: any) => {
            utilsAddLines({
              viewer: viewerRef,
              lines: coordinates,
            });
          });
        })
        .catch(e => console.error(e));
    });
  }, [viewerRef, boundaryCoordinate]);

  return (
    <CesiumInitBody
      isFullHeight
      containerRef={containerRef}
      isNonBackground
      children={
        <div className='absolute bottom-10 left-4 z-40 grid grid-cols-1'>
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
          <button
            className='p-2 text-gray-700 bg-red-100 rounded-sm mb-2'
            onClick={utilsCesiumFlyto({
              viewer: viewerRef,
              type: '',
              name: InitPosition,
              position: {
                ...boundaryCoordinate.center,
                height: 200,
              },
            })}
            children={'초기 위치'}
          />
        </div>
      }
    />
  );
};
