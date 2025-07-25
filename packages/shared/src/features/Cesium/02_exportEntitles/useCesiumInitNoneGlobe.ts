import * as Cesium from 'cesium';
import { useRef, useState } from 'react';
import * as Hook from '../03_hooks';
import type * as Ty from '../05_shared/types';

export const useCesiumInitNoneGlobe = ({
  addImageryLayers,
  boundaryCoordinate,
  cameraInitCoordinate,
}: Ty.useCesiumInitNoneGlobeProps): Ty.useCesiumInitReturn => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewer, setViewer] = useState<Cesium.Viewer | null>(null);

  Hook.useEffectCesiumViewerNoneGlobe({
    containerRef,
    addImageryLayers,
    setViewer,
    coordinate: cameraInitCoordinate,
  });
  Hook.useEffectCesiumBoundaryLimit({
    viewer,
    boundaryCoordinate,
  });
  Hook.useEffectCesiumCameraController({ viewer });

  return {
    containerRef: containerRef,
    viewerRef: viewer,
  };
};
