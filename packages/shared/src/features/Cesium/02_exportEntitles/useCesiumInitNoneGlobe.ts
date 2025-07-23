import { useRef, useState } from 'react';
import * as Cesium from 'cesium';
import * as Hook from '../03_hooks';
import * as Const from '../05_shared/cesiumConst';
import type * as Ty from '../05_shared/types';

export const useCesiumInitNoneGlobe = ({
  addImageryLayers,
}: Ty.useCesiumInitProps): Ty.useCesiumInitReturn => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewer, setViewer] = useState<Cesium.Viewer | null>(null);

  Hook.useEffectCesiumViewerNoneGlobe({
    containerRef,
    addImageryLayers,
    setViewer,
    coordinate: Const.CesiumCoordinate,
  });
  Hook.useEffectCesiumBoundaryLimit({
    viewer,
    coordinate: {
      lon: Const.CesiumCoordinate.lon,
      lat: Const.CesiumCoordinate.lat,
    },
  });

  return {
    containerRef: containerRef,
    viewerRef: viewer,
  };
};
