import { utilsThrottle } from '@_shared';
import * as Cesium from 'cesium';
import type { utilsCesiumFlytoProps } from '../05_shared/types';

export const utilsCesiumFlyto =
  ({
    viewer,
    name,
    position: { lon, lat, height = 0, heading = 0 },
  }: utilsCesiumFlytoProps) =>
  (): void => {
    if (!viewer) return;

    const destination = Cesium.Cartesian3.fromDegrees(lon, lat, height);
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
