import * as Cesium from 'cesium';

export const utilsAddHorizontalLine = ({
  viewerRef,
  lineList,
}: {
  viewerRef: Cesium.Viewer | null;
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
  if (!viewerRef) return;

  const positions = lineList.reduce<number[]>((acc, current) => {
    return [...acc, current.lon, current.lat, current.height];
  }, []);

  viewerRef.entities.add({
    // name: 'utilsAddHorizontalLine',
    polylineVolume: {
      positions: Cesium.Cartesian3.fromDegreesArrayHeights(positions),
      shape: computeCircle(0.3),
      material: Cesium.Color.NAVAJOWHITE,
    },
  });
  return;
};
