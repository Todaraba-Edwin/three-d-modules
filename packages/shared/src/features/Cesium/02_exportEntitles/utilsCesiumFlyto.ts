import { utilsThrottle } from '@_shared';
import * as Cesium from 'cesium';
import { utilsSetInitCameraPosition } from '../04_utils';
import type { utilsCesiumFlytoProps } from '../05_shared/types';

// 초기 위치를 설정할 경우
export const InitPosition = 'initPosition';
export const utilsCesiumFlyto =
  ({
    viewer,
    name, // initPosition 초기위치에 대한 값
    position: { lon, lat, height = 0, heading = 0 },
  }: utilsCesiumFlytoProps) =>
  (): void => {
    if (!viewer) return;
    const isInitPosition = name === InitPosition;
    const destination = isInitPosition
      ? utilsSetInitCameraPosition({
          coordinate: {
            lon,
            lat,
          },
          initCameraHeight: height,
        })
      : Cesium.Cartesian3.fromDegrees(lon, lat, height);

    const key = name;

    const fly = () =>
      viewer.camera.flyTo({
        destination,
        orientation: {
          heading: Cesium.Math.toRadians(heading),
          pitch: Cesium.Math.toRadians(-25),
          roll: 0,
        },
        duration: 1.5,
      });

    utilsThrottle(key, fly, 2500, false)();
  };
