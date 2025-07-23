import { type ReactNode } from 'react';
import { CesiumInitBody } from '../1_CesiumInitBody/CesiumInitBody';
import { useCesiumInitNoneGlobe } from '../../02_exportEntitles';
import * as Cesium from 'cesium';
import { CesiumCoordinate } from '../../05_shared/cesiumConst';
import { utilsGetDegreeFromMeter } from '../../04_utils';

export const CesiumBuilding = (): ReactNode => {
  const { containerRef, viewerRef } = useCesiumInitNoneGlobe({});

  const flyToModel = (key: string) => {
    const viewer = viewerRef;
    if (!viewer) return;
    const isBuilding = key === '문화시설';
    const isBuilding2 = key === '문화시설2';
    const { lon, lat, height } = isBuilding
      ? // 문화시설
        {
          lon: CesiumCoordinate.lon,
          lat:
            CesiumCoordinate.lat -
            utilsGetDegreeFromMeter({ type: 'lat', meter: 160 }),
          height: 80, // 조금 위쪽
        }
      : !isBuilding2
        ? {
            // 체육관
            lon:
              CesiumCoordinate.lon +
              utilsGetDegreeFromMeter({
                type: 'lon',
                meter: 0,
                lat: CesiumCoordinate.lat,
              }),
            lat:
              CesiumCoordinate.lat -
              utilsGetDegreeFromMeter({ type: 'lat', meter: 0 }),
            height: 80, // 조금 위쪽
          }
        : {
            // 문화시설2
            lon:
              CesiumCoordinate.lon +
              utilsGetDegreeFromMeter({
                type: 'lon',
                meter: 60,
                lat: CesiumCoordinate.lat,
              }),
            lat:
              CesiumCoordinate.lat +
              utilsGetDegreeFromMeter({ type: 'lat', meter: 160 }),
            height: 80, // 조금 위쪽
          };
    const destination = Cesium.Cartesian3.fromDegrees(lon, lat, height);

    viewer.camera.flyTo({
      destination,
      orientation: {
        heading: Cesium.Math.toRadians(
          isBuilding2 ? 135 : !isBuilding ? 90 : 0
        ),
        pitch: Cesium.Math.toRadians(-25),
        roll: 0,
      },
      duration: 1.5,
    });
  };

  return (
    <div className="relative w-full h-screen bg-[url('/imgs/bg.791eddb2.png')] bg-cover bg-no-repeat bg-center  bg-[length:auto]">
      <div className='absolute top-4 left-4 z-[99] grid grid-cols-1'>
        <button
          className='p-2 text-gray-700 bg-red-100 rounded-sm mb-2'
          onClick={() => flyToModel('문화시설')}
        >
          문화시설
        </button>
        <button
          className='p-2 text-gray-700 bg-red-100 rounded-sm mb-2'
          onClick={() => flyToModel('체육관')}
        >
          체육관
        </button>
        <button
          className='p-2 text-gray-700 bg-red-100 rounded-sm mb-2'
          onClick={() => flyToModel('문화시설2')}
        >
          문화시설2
        </button>
      </div>
      <CesiumInitBody isFullHeight containerRef={containerRef} />
    </div>
  );
};
