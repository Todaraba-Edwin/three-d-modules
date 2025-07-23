import type { ReactNode } from 'react';
import './tailwind.css';
// const VITE_BASE_VWORLD = import.meta.env.VITE_BASE_VWORLD;

// import {
//   // CesiumVworldImageryLayers,
//   // CesiumInitBody,
//   // useCesiumInit,
//   // useVworldMapInfo,
//   CesiumBuilding,
// } from './features';

function App(): ReactNode {
  // return <CesiumBuilding />;
  return <div>테스트</div>
}

// function App(): ReactNode {
//   const { addImageryLayers, vWorldMapArrByType } = useVworldMapInfo({
//     apiKey: VITE_BASE_VWORLD,
//   });
//   const { containerRef, viewerRef } = useCesiumInit({
//     addImageryLayers,
//   });

//   return (
//     <CesiumInitBody
//       isFullHeight
//       containerRef={containerRef}
//       children={
//         <CesiumVworldImageryLayers
//           vWorldMapArrByType={vWorldMapArrByType}
//           viewerRef={viewerRef}
//           addImageryLayers={addImageryLayers}
//         />
//       }
//     />
//   );
// }

export default App;
