import * as Cesium from 'cesium';
import type * as Ty from '../05_shared/types';
import { utilsSetModelID } from './utilsSetModelID';

export const utilsSetGltfAsync = ({
  viewer,
  glbList,
}: Ty.utilsSetGltfAsyncProps): void => {
  if (!viewer) return;
  if (!glbList.length) return;

  glbList.forEach(
    ({
      name,
      type,
      url,
      positions: { lon, lat, height, heading = 0, scale },
      isError,
    }: Ty.GlbListType) => {
      (async () => {
        const modelPosition = Cesium.Cartesian3.fromDegrees(lon, lat, height);
        const modelHeadingPitchRoll = new Cesium.HeadingPitchRoll(
          Cesium.Math.toRadians(heading),
          0,
          0
        );
        const modelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(
          modelPosition,
          modelHeadingPitchRoll
        );

        const model = await Cesium.Model.fromGltfAsync({
          url,
          modelMatrix,
          scale,
          id: utilsSetModelID({
            name,
            groupName: type,
          }),
          ...(isError && {
            silhouetteColor: Cesium.Color.ORANGERED, // 빨간 테두리
            silhouetteSize: 5.0,
          }),
        });

        viewer.scene.primitives.add(model);
      })();
    }
  );
  return;
};
