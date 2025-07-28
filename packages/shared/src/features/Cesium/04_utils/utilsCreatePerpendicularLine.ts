import * as Cesium from 'cesium';

export const utilsCreatePerpendicularLine = ({
  viewerRef,
  list: { lon, lat, height, lineWeight, length },
}: {
  viewerRef: Cesium.Viewer | null;
  list: {
    lon: number;
    lat: number;
    height: number;
    length: number;
    lineWeight: number;
  };
}): void => {
  if (!viewerRef) return;

  const position = Cesium.Cartesian3.fromDegrees(
    lon,
    lat,
    height + lineWeight + length / 2
  );
  const modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(position);

  const geometry = new Cesium.CylinderGeometry({
    length: length, // 전체 높이
    topRadius: lineWeight,
    bottomRadius: 0.3,
  });

  const geometryInstance = new Cesium.GeometryInstance({
    geometry,
    modelMatrix,
  });

  const primitive = new Cesium.Primitive({
    geometryInstances: [geometryInstance],
    appearance: new Cesium.MaterialAppearance({
      material: Cesium.Material.fromType('Color', {
        color: Cesium.Color.NAVAJOWHITE, // 불투명 회색
      }),
      translucent: false,
      closed: true,
    }),
  });

  viewerRef.scene.primitives.add(primitive);
  return;
};
