import { type ReactNode } from 'react';
import * as Shared from '@monorepo/shared';
const VITE_BASE_VWORLD = import.meta.env.VITE_BASE_VWORLD;

export const Cesium = (): ReactNode => {
  const { addImageryLayers, vWorldMapArrByType } = Shared.useVworldMapInfo({
    apiKey: '',
  });
  const { containerRef, viewerRef } = Shared.useCesiumInit({
    addImageryLayers,
  });
  return (
    <Shared.CesiumInitBody
      containerRef={containerRef}
      children={
        <Shared.CesiumAddIVworildmageryLayers
          apiKey={VITE_BASE_VWORLD}
          vWorldMapArrByType={vWorldMapArrByType}
          viewerRef={viewerRef}
          addImageryLayers={addImageryLayers}
        />
      }
    ></Shared.CesiumInitBody>
  );
};
