import * as Cesium from 'cesium';
import { useEffect, useRef } from 'react';
import { utilsSetGltfAsync, utilsUpdateGltfPosition } from '../04_utils';
import type { BoundaryCoordinateType, GlbListType } from '../05_shared/types';

export const useSetGltfAsync = ({
  viewer,
  glbList,
  boundaryCoordinate,
  selectedFloor,
}: {
  viewer: Cesium.Viewer | null;
  glbList: GlbListType[];
  boundaryCoordinate: BoundaryCoordinateType;
  selectedFloor?: number;
}): void => {
  const isInitialLoad = useRef(true);

  useEffect(() => {
    if (!viewer) return;

    if (isInitialLoad.current) {
      utilsSetGltfAsync({
        viewer: viewer,
        glbList: glbList,
      });
      isInitialLoad.current = false;
    } else {
      utilsUpdateGltfPosition({
        viewer: viewer,
        glbList: glbList,
        selectedFloor
      });
    }
  }, [viewer, glbList, boundaryCoordinate, selectedFloor]);
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
