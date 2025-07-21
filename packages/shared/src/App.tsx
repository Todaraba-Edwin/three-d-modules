import type { ReactNode } from 'react';
import './App.css';

import {
  CesiumAddIVworildmageryLayers,
  CesiumInitBody,
  useCesiumInit,
  useVworldMapInfo,
} from './03_features';
const VITE_BASE_VWORLD = import.meta.env.VITE_BASE_VWORLD;

function App(): ReactNode {
  const { addImageryLayers, vWorldMapArrByType } = useVworldMapInfo({
    apiKey: VITE_BASE_VWORLD,
  });
  const { containerRef, viewerRef } = useCesiumInit({
    addImageryLayers,
  });

  return (
    <CesiumInitBody
      containerRef={containerRef}
      children={
        <CesiumAddIVworildmageryLayers
          vWorldMapArrByType={vWorldMapArrByType}
          viewerRef={viewerRef}
          addImageryLayers={addImageryLayers}
        />
      }
    />
  );
}

export default App;
