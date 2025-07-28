import * as Cesium from 'cesium';
import type { utilsGetListBoundaryReturn } from '../05_shared/types';
import { utilsGetDegreeFromMeter } from './utilsGetDegreeFromMeter';

export const utilsSetFloor = ({
  viewer,
  boundaryCoordinate: { west, east, south, north },
  color = Cesium.Color.GRAY.withAlpha(0.5),
}: {
  viewer: Cesium.Viewer | null;
  boundaryCoordinate: utilsGetListBoundaryReturn;
  color: Cesium.Color;
}): void => {
  if (!viewer) return;

  const weight = utilsGetDegreeFromMeter({
    type: 'lat',
    meter: 100,
  });

  const rectangleGeometry = new Cesium.RectangleGeometry({
    rectangle: Cesium.Rectangle.fromDegrees(
      west - weight,
      south - weight,
      east + weight,
      north + weight
    ),
    height: 0.0, // 지표면 위
  });

  const geometryInstance = new Cesium.GeometryInstance({
    geometry: rectangleGeometry,
    attributes: {
      color: Cesium.ColorGeometryInstanceAttribute.fromColor(color),
    },
  });

  const primitive = new Cesium.Primitive({
    geometryInstances: geometryInstance,
    appearance: new Cesium.PerInstanceColorAppearance({
      translucent: true,
      closed: true,
    }),
    asynchronous: false,
  });

  viewer.scene.primitives.add(primitive);
  return;
};
