import { useRef, useState } from 'react';
import * as Cesium from 'cesium';
import * as Hook from '../03_hooks';
import * as Const from '../05_shared/cesiumConst';
import type * as Ty from '../05_shared/types';

Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(
  Const.CesiumCoordinate.lon - 0.01, // 서쪽
  Const.CesiumCoordinate.lat - 0.01, // 남쪽
  Const.CesiumCoordinate.lon + 0.01, // 동쪽
  Const.CesiumCoordinate.lat + 0.01 // 북쪽
);
Cesium.Camera.DEFAULT_VIEW_FACTOR = 0;

export const useCesiumInit = ({
  addImageryLayers,
}: Ty.useCesiumInitProps): Ty.useCesiumInitReturn => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewer, setViewer] = useState<Cesium.Viewer | null>(null);

  Hook.useEffectCesiumViewer({
    containerRef,
    addImageryLayers,
    setViewer,
    coordinate: Const.CesiumCoordinate,
  });
  Hook.useEffectCesiumBoundaryLimit({ viewer });
  Hook.useEffectCesiumCameraController({ viewer });

  if (!containerRef.current) {
    return {
      containerRef: containerRef,
      viewerRef: viewer,
    };
  }

  return {
    containerRef: containerRef,
    viewerRef: viewer,
  };
};
