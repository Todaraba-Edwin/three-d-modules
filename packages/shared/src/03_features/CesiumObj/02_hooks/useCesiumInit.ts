import * as Cesium from 'cesium';
import { useRef, useState } from 'react';
import { useEffectCesiumBoundaryLimit, useEffectCesiumViewer } from '.';

const seoulCityHall = {
  lon: 126.9784,
  lat: 37.5667,
};
Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(
  seoulCityHall.lon - 0.01, // 서쪽
  seoulCityHall.lat - 0.01, // 남쪽
  seoulCityHall.lon + 0.01, // 동쪽
  seoulCityHall.lat + 0.01 // 북쪽
);
Cesium.Camera.DEFAULT_VIEW_FACTOR = 0;

type useCesiumInitReturn = {
  containerRef: React.RefObject<HTMLDivElement | null>;
  viewerRef: Cesium.Viewer | null;
};

export type useCesiumInitProps = {
  addImageryLayers?: {
    type: string;
    typeName: string;
    url: string;
    isDefault: boolean;
  }[];
};

export interface CustomImageryLayer extends Cesium.ImageryLayer {
  name?: string;
}

export const useCesiumInit = ({
  addImageryLayers,
}: useCesiumInitProps): useCesiumInitReturn => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewer, setViewer] = useState<Cesium.Viewer | null>(null);

  useEffectCesiumViewer({
    containerRef,
    addImageryLayers,
    setViewer,
    seoulCityHall,
  });
  useEffectCesiumBoundaryLimit({ viewer });

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
