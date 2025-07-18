import {
  CesiumAddIVworildmageryLayers,
  CesiumInitBody,
  useCesiumInit,
  useVworldMapInfo,
} from '@monorepo/shared';
import { type ReactNode } from 'react';
const VITE_BASE_VWORLD = import.meta.env.VITE_BASE_VWORLD;

export const Cesium = (): ReactNode => {
  const { addImageryLayers, vWorldMapArrByType } = useVworldMapInfo({
    apiKey: '',
  });
  const { containerRef, viewerRef } = useCesiumInit({
    addImageryLayers,
  });
  return (
    <CesiumInitBody
      containerRef={containerRef}
      children={
        <CesiumAddIVworildmageryLayers
          apiKey={VITE_BASE_VWORLD}
          vWorldMapArrByType={vWorldMapArrByType}
          viewerRef={viewerRef}
          addImageryLayers={addImageryLayers}
        />
      }
    ></CesiumInitBody>
  );
};
