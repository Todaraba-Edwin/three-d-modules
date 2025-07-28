import { utilsThrottle } from '@_shared';
import * as Cesium from 'cesium';
import { utilsGetModelID, utilsSetInitCameraPosition } from '../04_utils';
import type { utilsCesiumFlytoProps } from '../05_shared/types';

// 초기 위치를 설정할 경우
export const InitPosition = 'initPosition';
export const utilsCesiumFlyto =
  ({
    viewer,
    name, // initPosition 초기위치에 대한 값
    type,
    position: { lon, lat, height = 0, heading = 0 },
  }: utilsCesiumFlytoProps) =>
  (): void => {
    if (!viewer) return;
    const isInitPosition = name === InitPosition;
    const destination = isInitPosition
      ? utilsSetInitCameraPosition({
          coordinate: {
            lon,
            lat,
          },
          initCameraHeight: height,
        })
      : Cesium.Cartesian3.fromDegrees(lon, lat, height);

    const key = name;

    if (destination) {
      const primitives = viewer.scene.primitives;
      for (let i = 0; i < primitives.length; i++) {
        const primitive = primitives.get(i);

        const getId = utilsGetModelID(primitive.id);

        if (isInitPosition) {
          primitive.color = Cesium.Color.WHITE.withAlpha(1);
          primitive.colorBlendMode = Cesium.ColorBlendMode.MIX;
          primitive.colorBlendAmount = 0;
        }

        if (!isInitPosition) {
          if (getId.name === name) {
            if (primitive.silhouetteSize) {
              primitive.silhouetteSize = 0;
              primitive.silhouetteColor = Cesium.Color.TRANSPARENT;
            } else {
              primitive.silhouetteSize = 5;
              primitive.silhouetteColor = Cesium.Color.RED;
            }
          }

          if (getId.groupName != type) {
            primitive.color = Cesium.Color.TRANSPARENT.withAlpha(0.3);
            primitive.colorBlendMode = Cesium.ColorBlendMode.MIX;
          } else {
            primitive.color = Cesium.Color.WHITE.withAlpha(1);
            primitive.colorBlendMode = Cesium.ColorBlendMode.MIX;
            primitive.colorBlendAmount = 0;
          }
        }
      }
    }

    const fly = () =>
      viewer.camera.flyTo({
        destination,
        orientation: {
          heading: Cesium.Math.toRadians(heading),
          pitch: Cesium.Math.toRadians(-25),
          roll: 0,
        },
        duration: 1.5,
      });

    utilsThrottle(key, fly, 2500, false)();
  };
