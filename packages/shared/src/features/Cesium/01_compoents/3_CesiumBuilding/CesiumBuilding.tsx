import { type ReactNode } from 'react';
import { CesiumInitBody } from '../1_CesiumInitBody/CesiumInitBody';
import { useCesiumInitNoneGlobe } from '../../02_exportEntitles';
import * as Cesium from 'cesium';
import { CesiumCoordinate } from '../../05_shared/cesiumConst';

export const CesiumBuilding = (): ReactNode => {
  const { containerRef, viewerRef } = useCesiumInitNoneGlobe({});

  const flyToModel = (key: string) => {
    const viewer = viewerRef;
    if (!viewer) return;
    const isBuilding = key === '문화시설';
    const isBuilding2 = key === '문화시설2';
    const { lon, lat, height } = isBuilding
      ? {
          lon: CesiumCoordinate.lon,
          lat: CesiumCoordinate.lat - 0.0015,
          height: 80, // 조금 위쪽
        }
      : isBuilding2
        ? {
            lon: CesiumCoordinate.lon + 0.0009,
            lat: CesiumCoordinate.lat - 0.0015 + 0.0015 + 0.0015,
            height: 80, // 조금 위쪽
          }
        : {
            lon: CesiumCoordinate.lon - 0.00005,
            lat: CesiumCoordinate.lat - 0.0015 + 0.0015,
            height: 80, // 조금 위쪽
          };
    const destination = Cesium.Cartesian3.fromDegrees(lon, lat, height);

    viewer.camera.flyTo({
      destination,
      orientation: {
        heading: Cesium.Math.toRadians(isBuilding2 ? 135 : !isBuilding ? 90 : 0),
        pitch: Cesium.Math.toRadians(-25),
        roll: 0,
      },
      duration: 1.5,
    });
  };

  return (
    <div className='relative'>
      <div className='absolute top-0 left-0 z-[99] grid grid-cols-1'>
        <button onClick={() => flyToModel('문화시설')}>문화시설</button>
        <button onClick={() => flyToModel('체육관')}>체육관</button>
        <button onClick={() => flyToModel('문화시설2')}>문화시설2</button>
      </div>
      <CesiumInitBody isFullHeight containerRef={containerRef} />
    </div>
  );
};
