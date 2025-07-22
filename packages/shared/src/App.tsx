import type { ReactNode } from 'react';
import './App.css';

import {
  CesiumVworldImageryLayers,
  CesiumInitBody,
  useCesiumInit,
  useVworldMapInfo,
} from './features';
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
        <CesiumVworldImageryLayers
          vWorldMapArrByType={vWorldMapArrByType}
          viewerRef={viewerRef}
          addImageryLayers={addImageryLayers}
        />
      }
    />
  );
}

export default App;
