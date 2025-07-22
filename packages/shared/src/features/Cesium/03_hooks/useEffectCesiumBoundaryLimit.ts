import { useEffect } from 'react';
import * as Cesium from 'cesium';
import type * as Ty from '../05_shared/types';

export const useEffectCesiumBoundaryLimit = ({
  viewer,
}: Ty.ViewerProps): void => {
  useEffect(() => {
    if (!viewer) return;
    // 한국 영역 제한
    const KOREA_RECTANGLE = Cesium.Rectangle.fromDegrees(
      124.0,
      28,
      132.0,
      42.0
    );

    const restrictCameraMovement = () => {
      const camera = viewer.camera;
      const position = camera.positionCartographic;
      if (!Cesium.Rectangle.contains(KOREA_RECTANGLE, position)) {
        const clampedLon = Cesium.Math.clamp(
          Cesium.Math.toDegrees(position.longitude),
          Cesium.Math.toDegrees(KOREA_RECTANGLE.west),
          Cesium.Math.toDegrees(KOREA_RECTANGLE.east)
        );
        const clampedLat = Cesium.Math.clamp(
          Cesium.Math.toDegrees(position.latitude),
          Cesium.Math.toDegrees(KOREA_RECTANGLE.south),
          Cesium.Math.toDegrees(KOREA_RECTANGLE.north)
        );
        const height = position.height;
        camera.setView({
          destination: Cesium.Cartesian3.fromRadians(
            Cesium.Math.toRadians(clampedLon),
            Cesium.Math.toRadians(clampedLat),
            height
          ),
          orientation: {
            heading: camera.heading,
            pitch: camera.pitch,
            roll: camera.roll,
          },
        });
      }
    };

    viewer.clock.onTick.addEventListener(restrictCameraMovement);

    return () => {
      viewer.clock.onTick.removeEventListener(restrictCameraMovement);
    };
  }, [viewer]);
  return;
};
