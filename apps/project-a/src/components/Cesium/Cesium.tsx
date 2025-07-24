import * as Shared from '@monorepo/shared';
import { type ReactNode } from 'react';
const VITE_BASE_VWORLD = import.meta.env.VITE_BASE_VWORLD;

export const Cesium = (): ReactNode => {
  const { addImageryLayers, vWorldMapArrByType } = Shared.useVworldMapInfo({
    apiKey: VITE_BASE_VWORLD,
  });
  const { containerRef, viewerRef } = Shared.useCesiumInit({
    addImageryLayers,
  });

  console.log('addImageryLayers', addImageryLayers);

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
