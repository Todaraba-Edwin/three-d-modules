import * as Const from '../05_shared/cesiumConst';
import type * as Ty from '../05_shared/types';

export const utilsRemoteZoomDistance = ({ viewer }: Ty.ViewerProps): void => {
  if (!viewer) return;
  const { minimumZoomDistance, maximumZoomDistance } =
    Const.CesiumCameraControll;
  viewer.scene.screenSpaceCameraController.minimumZoomDistance =
    minimumZoomDistance; // 최소 고도 (예: 1m 단위로)
  viewer.scene.screenSpaceCameraController.maximumZoomDistance =
    maximumZoomDistance; // 최대 고도(1m 단위로)
  return;
};
