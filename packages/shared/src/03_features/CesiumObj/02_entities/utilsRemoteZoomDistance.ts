import * as Cesium from 'cesium';

type Props = {
  viewer: Cesium.Viewer | null;
};

export const utilsRemoteZoomDistance = ({ viewer }: Props): void => {
  if (!viewer) return;
  viewer.scene.screenSpaceCameraController.minimumZoomDistance = 50; // 최소 고도 (예: 1m 단위로)
  viewer.scene.screenSpaceCameraController.maximumZoomDistance = 1000000; // 최대 고도(1m 단위로) : 1000km - 한반도
  return;
};
