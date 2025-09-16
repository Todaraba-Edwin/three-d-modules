import * as Cesium from 'cesium';
import { useEffect } from 'react';
import { utilsSetGltfAsync } from '../04_utils';
import type { BoundaryCoordinateType, GlbListType } from '../05_shared/types';

export const useSetGltfAsync = ({
  viewer,
  glbList,
  boundaryCoordinate,
  isFloor = false,
}: {
  viewer: Cesium.Viewer | null;
  glbList: GlbListType[];
  boundaryCoordinate: BoundaryCoordinateType;
  isFloor?: boolean;
}): void => {
  useEffect(() => {
    if (!viewer) return;
    // 3️⃣ GLB 객체 추가

    setTimeout(() => {
      utilsSetGltfAsync({
        viewer: viewer,
        glbList: glbList,
      });
    });
  }, [viewer, boundaryCoordinate, glbList, isFloor]);
};

/*
      // if (isFloor) {
      //   utilsSetFloor({
      //     viewer: viewer,
      //     boundaryCoordinate,
      //     color: Cesium.Color.DARKGRAY.withAlpha(0.3),
      //   });
      // }
*/
