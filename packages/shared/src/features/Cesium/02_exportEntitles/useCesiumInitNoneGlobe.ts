import * as Cesium from 'cesium';
import { useRef, useState } from 'react';
import * as Hook from '../03_hooks';
import type * as Ty from '../05_shared/types';

export const useCesiumInitNoneGlobe = ({
  addImageryLayers,
  initCameraHeight,
  cameraInitCoordinate,
  boundaryCoordinate,
  initCameraPosition,
}: Ty.useCesiumInitNoneGlobeProps): Ty.useCesiumInitReturn & {
  setViewer: any;
} => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewer, setViewer] = useState<Cesium.Viewer | null>(() => null);

  Hook.useEffectCesiumViewerNoneGlobe({
    containerRef,
    addImageryLayers,
    setViewer,
    initCameraHeight,
    coordinate: cameraInitCoordinate
      ? cameraInitCoordinate
      : boundaryCoordinate.center,
    initCameraPosition,
  });
  Hook.useEffectCesiumBoundaryLimit({
    containerRef,
    viewer,
    boundaryCoordinate,
  });
  Hook.useEffectCesiumCameraController({ viewer });

  return {
    containerRef: containerRef,
    viewerRef: viewer,
    setViewer,
  };
};
