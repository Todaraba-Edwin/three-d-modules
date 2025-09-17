import * as Cesium from 'cesium';
import type * as Ty from '../05_shared/types';
import { utilsSetModelID } from './utilsSetModelID';

export const utilsUpdateGltfPosition = ({
  viewer,
  glbList,
  selectedFloor = 0,
}: Ty.utilsSetGltfAsyncProps & {
  selectedFloor?: number;
}): void => {
  if (!viewer) return;
  if (!glbList.length) return;

  const { primitives } = viewer.scene;
  const targetType = glbList[selectedFloor].type;

  glbList.forEach(
    (
      {
        isError,
        name,
        type,
        positions: { lon, lat, height, heading = 0 },
      }: Ty.GlbListType,
      idx
    ) => {
      const modelId = utilsSetModelID({ name, groupName: type });
      const isSelectedGroupType = type === targetType && idx > 4;

      for (let i = 0; i < primitives.length; i++) {
        const model = primitives.get(i);
        if (model.id === modelId) {
          const modelPosition = Cesium.Cartesian3.fromDegrees(lon, lat, height);
          const modelHeadingPitchRoll = new Cesium.HeadingPitchRoll(
            Cesium.Math.toRadians(heading),
            0,
            0
          );
          model.modelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(
            modelPosition,
            modelHeadingPitchRoll
          );

          if (isSelectedGroupType) {
            model.color = Cesium.Color.WHITE.withAlpha(1);
            model.colorBlendMode = Cesium.ColorBlendMode.MIX;
            model.colorBlendAmount = 0;

            console.log('isError', isError, name);

            if (isError) {
              model.silhouetteColor = Cesium.Color.ORANGERED;
              model.silhouetteSize = 5.0;
            }
          } else if (selectedFloor === 0) {
            model.color = Cesium.Color.WHITE.withAlpha(1);
            model.colorBlendMode = Cesium.ColorBlendMode.MIX;
            model.colorBlendAmount = 0;
          } else if (idx > 0) {
            if (idx === selectedFloor) {
              model.color = Cesium.Color.WHITE.withAlpha(1);
              model.colorBlendMode = Cesium.ColorBlendMode.MIX;
              model.colorBlendAmount = 0;
            } else {
              model.color = Cesium.Color.TRANSPARENT.withAlpha(0.1);
              model.colorBlendMode = Cesium.ColorBlendMode.MIX;
            }
            model.silhouetteColor = Cesium.Color.TRANSPARENT;
            model.silhouetteSize = 0;
          }
          break;
        }
      }
    }
  );
};
