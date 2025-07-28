import * as Cesium from 'cesium';

export const utilsAdSphere = ({
  viewerRef,
  type,
  list: { lon, lat, height, lineWeight, length },
}: {
  viewerRef: Cesium.Viewer | null;
  type: 'isTopConnect' | 'isBottomConnect';
  list: {
    lon: number;
    lat: number;
    height: number;
    length: number;
    lineWeight: number;
  };
}): void => {
  if (!viewerRef) return;
  const isTopConnect = type === 'isTopConnect';

  const sphereCenter = Cesium.Cartesian3.fromDegrees(
    lon,
    lat,
    isTopConnect ? height + length + lineWeight : height + lineWeight
  ); // 높이 30m
  const modelMatrix2 = Cesium.Transforms.eastNorthUpToFixedFrame(sphereCenter);

  const sphereGeometry = new Cesium.EllipsoidGeometry({
    radii: new Cesium.Cartesian3(lineWeight, lineWeight, lineWeight), // 반지름 15m짜리 구체
  });

  const sphereInstance = new Cesium.GeometryInstance({
    geometry: sphereGeometry,
    modelMatrix: modelMatrix2,
  });

  const spherePrimitive = new Cesium.Primitive({
    geometryInstances: [sphereInstance],
    appearance: new Cesium.MaterialAppearance({
      material: Cesium.Material.fromType('Color', {
        color: Cesium.Color.NAVAJOWHITE,
      }),
      translucent: false,
      closed: true,
    }),
  });

  viewerRef.scene.primitives.add(spherePrimitive);
};
