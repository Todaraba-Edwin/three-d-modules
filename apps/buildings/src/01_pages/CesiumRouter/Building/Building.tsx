import {
  CesiumInitBody,
  useCesiumInitNoneGlobe,
  useSetGltfAsync,
  utilsAddHorizontalLine,
  utilsAddPerpendicularLine,
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
      const { lon, lat } = boundaryCoordinate.center;

      utilsAddHorizontalLine({
        viewerRef,
        lineList: [
          { lon: lon - 0.0005, lat: lat - 0.0005, height: 0 },
          { lon: lon - 0.0005, lat: lat - 0.0001, height: 0 },
          { lon: lon + 0.0005, lat: lat - 0.0001, height: 0 },
          { lon: lon + 0.0005, lat: lat - 0.0005, height: 0 },
        ],
      });

      utilsAddHorizontalLine({
        viewerRef,
        lineList: [
          { lon: lon - 0.0005, lat: lat - 0.0005, height: 15 },
          { lon: lon - 0.0005, lat: lat - 0.0001, height: 15 },
          { lon: lon + 0.0005, lat: lat - 0.0001, height: 15 },
          { lon: lon + 0.0005, lat: lat - 0.0005, height: 15 },
        ],
      });

      utilsAddHorizontalLine({
        viewerRef,
        lineList: [
          { lon: lon - 0.0005, lat: lat - 0.0005, height: 30 },
          { lon: lon - 0.0005, lat: lat - 0.0001, height: 30 },
          { lon: lon, lat: lat - 0.0005, height: 30 },
          { lon: lon + 0.0005, lat: lat - 0.0001, height: 30 },
          { lon: lon + 0.0005, lat: lat - 0.0005, height: 30 },
        ],
      });

      utilsAddPerpendicularLine({
        viewerRef,
        lineList: [
          {
            lon: lon - 0.0005,
            lat: lat - 0.0005,
            height: 0,
            length: 15,
            isTopConnect: true,
            isBottomConnect: true,
          },
          {
            lon: lon - 0.0005,
            lat: lat - 0.0001,
            height: 0,
            length: 15,
            isTopConnect: true,
            isBottomConnect: true,
          },
          {
            lon: lon + 0.0005,
            lat: lat - 0.0001,
            height: 0,
            length: 15,
            isTopConnect: true,
            isBottomConnect: true,
          },
          {
            lon: lon + 0.0005,
            lat: lat - 0.0005,
            height: 0,
            length: 15,
            isTopConnect: true,
            isBottomConnect: true,
          },
          {
            lon: lon - 0.0005,
            lat: lat - 0.0005,
            height: 15,
            length: 15,
            isTopConnect: true,
            isBottomConnect: true,
          },
          {
            lon: lon - 0.0005,
            lat: lat - 0.0001,
            height: 15,
            length: 15,
            isTopConnect: true,
            isBottomConnect: true,
          },
          {
            lon: lon + 0.0005,
            lat: lat - 0.0001,
            height: 15,
            length: 15,
            isTopConnect: true,
            isBottomConnect: true,
          },
          {
            lon: lon + 0.0005,
            lat: lat - 0.0005,
            height: 15,
            length: 15,
            isTopConnect: true,
            isBottomConnect: true,
          },
          {
            lon: lon,
            lat: lat - 0.0005,
            height: 30,
            length: 15,
            isTopConnect: true,
            isBottomConnect: true,
          },
          {
            lon: lon,
            lat: lat - 0.0005,
            height: 0,
            length: 30,
            isTopConnect: true,
            isBottomConnect: true,
          },
        ],
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
