import * as Cesium from 'cesium';
import { useEffect } from 'react';
import type * as Ty from '../05_shared/types';

export const useEffectCesiumBoundaryLimit = ({
  viewer,
  coordinate,
}: Ty.ViewerProps): void => {
  useEffect(() => {
    if (!viewer) return;

    const caluCoordinate = 0.001;
    const rectangleCoor = coordinate
      ? Cesium.Rectangle.fromDegrees(
          coordinate.lon - caluCoordinate - 0.0004,
          coordinate.lat - caluCoordinate * 8 - 0.0004,
          coordinate.lon + caluCoordinate + 0.0004,
          coordinate.lat + caluCoordinate + 0.0004
        )
      : // 한국 영역 제한
        Cesium.Rectangle.fromDegrees(124.0, 28, 132.0, 42.0);

    const restrictCameraMovement = () => {
      const camera = viewer.camera;
      const position = camera.positionCartographic;
      if (!Cesium.Rectangle.contains(rectangleCoor, position)) {
        const clampedLon = Cesium.Math.clamp(
          Cesium.Math.toDegrees(position.longitude),
          Cesium.Math.toDegrees(rectangleCoor.west),
          Cesium.Math.toDegrees(rectangleCoor.east)
        );
        const clampedLat = Cesium.Math.clamp(
          Cesium.Math.toDegrees(position.latitude),
          Cesium.Math.toDegrees(rectangleCoor.south),
          Cesium.Math.toDegrees(rectangleCoor.north)
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
  }, [viewer, coordinate]);
  return;
};
