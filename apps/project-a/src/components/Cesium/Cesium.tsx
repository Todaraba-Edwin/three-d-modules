import { type ReactNode } from 'react';
import * as Shared from '@monorepo/shared';
const VITE_BASE_VWORLD = import.meta.env.VITE_BASE_VWORLD;

export const Cesium = (): ReactNode => {
  const { addImageryLayers, vWorldMapArrByType } = Shared.useVworldMapInfo({
    apiKey: VITE_BASE_VWORLD,
  });
  const { containerRef, viewerRef } = Shared.useCesiumInit({
    addImageryLayers,
  });
  return (
    <Shared.CesiumInitBody
      isFullHeight
      containerRef={containerRef}
      children={
        <Shared.CesiumVworldImageryLayers
          vWorldMapArrByType={vWorldMapArrByType}
          viewerRef={viewerRef}
          addImageryLayers={addImageryLayers}
        />
      }
    ></Shared.CesiumInitBody>
  );
};
