import type * as Ty from '../05_shared/types';

export const utilsRemoteDepthTestAgainstTerrain = ({
  viewer,
}: Ty.ViewerProps): void => {
  if (!viewer) return;
  viewer.scene.globe.depthTestAgainstTerrain = true; // 3D 모듈 생성시, 가시거리 제한  return;
};
