import * as Cesium from 'cesium';
import type { ViewerProps } from '../05_shared/types';

export const utilsAddHorizontalLine = ({
  viewer,
  lineList,
}: {
  viewer: ViewerProps['viewer'];
  lineList: {
    lon: number;
    lat: number;
    height: number;
  }[];
}): void => {
  function computeCircle(radius: number) {
    const positions = [];
    const sides = 64;
    for (let i = 0; i < sides; i++) {
      const angle = Cesium.Math.TWO_PI * (i / sides);
      positions.push(
        new Cesium.Cartesian2(
          Math.cos(angle) * radius,
          Math.sin(angle) * radius
        )
      );
    }
    return positions;
  }
  if (!viewer) return;

  // const positions = lineList.reduce<number[]>((acc, current) => {
  //   return [...acc, current.lon, current.lat, current.height];
  // }, []);
  const positions = lineList.flatMap(current => [
    current.lon,
    current.lat,
    current.height,
  ]);

  viewer.entities.add({
    name: 'horizontalLine',
    polylineVolume: {
      positions: Cesium.Cartesian3.fromDegreesArrayHeights(positions),
      shape: computeCircle(0.3),
      material: Cesium.Color.NAVAJOWHITE,
    },
  });
  return;
};
