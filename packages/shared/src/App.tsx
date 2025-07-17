import type { ReactNode } from 'react';

import './App.css';
import { Vworld } from './03_features/CesiumObj/01_features/Vworld/Vworld';
// import { Cesium3DModules, CesiumMap } from './03_features';

function App(): ReactNode {
  // return <Cesium3DModules />;
  // return <CesiumMap />
  // return <div>테스트</div>
  return <Vworld />;
}

export default App;
