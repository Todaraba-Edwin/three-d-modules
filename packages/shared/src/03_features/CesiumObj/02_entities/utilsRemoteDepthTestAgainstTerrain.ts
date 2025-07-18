import * as Cesium from 'cesium';

type Props = {
  viewer: Cesium.Viewer | null;
};

export const utilsRemoteDepthTestAgainstTerrain = ({ viewer }: Props): void => {
  if (!viewer) return;
  viewer.scene.globe.depthTestAgainstTerrain = true; // 3D 모듈 생성시, 가시거리 제한  return;
};
