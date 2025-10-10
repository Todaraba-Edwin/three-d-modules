import * as Cesium from 'cesium';
import { useEffect } from 'react';
import { utilsGetDegreeFromMeter } from '../02_exportEntitles/utilsGetDegreeFromMeter';
import type * as Ty from '../05_shared/types';

export const useEffectCesiumBoundaryLimit = ({
  containerRef,
  viewer,
  boundaryCoordinate,
}: Ty.ViewerProps): void => {
  useEffect(() => {
    if (!viewer) return;
    const container = containerRef?.current;
    if (!container) return;

    const calcCoordinate = utilsGetDegreeFromMeter({
      type: 'lat',
      meter: 3000, // 위도기준 1000m
    });

    const rectangleCoordinate = boundaryCoordinate
      ? Cesium.Rectangle.fromDegrees(
          boundaryCoordinate.west - calcCoordinate,
          boundaryCoordinate.south - calcCoordinate,
          boundaryCoordinate.east + calcCoordinate,
          boundaryCoordinate.north + calcCoordinate
        )
      : // 한국 영역 제한
        Cesium.Rectangle.fromDegrees(124.0, 28, 132.0, 42.0);

    const restrictCameraMovement = () => {
      const camera = viewer.camera;
      const position = camera.positionCartographic;
      if (!Cesium.Rectangle.contains(rectangleCoordinate, position)) {
        const clampedLon = Cesium.Math.clamp(
          Cesium.Math.toDegrees(position.longitude),
          Cesium.Math.toDegrees(rectangleCoordinate.west),
          Cesium.Math.toDegrees(rectangleCoordinate.east)
        );
        const clampedLat = Cesium.Math.clamp(
          Cesium.Math.toDegrees(position.latitude),
          Cesium.Math.toDegrees(rectangleCoordinate.south),
          Cesium.Math.toDegrees(rectangleCoordinate.north)
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
    setTimeout(() => {
      viewer.clock.onTick.addEventListener(restrictCameraMovement);
    });

    return () => {
      // 컴포넌트가 언마운트 되었을 때, 넘어가기
      setTimeout(() => {
        viewer.clock.onTick.removeEventListener(restrictCameraMovement);
      });
    };
  }, [containerRef, viewer, boundaryCoordinate]);
  return;
};
