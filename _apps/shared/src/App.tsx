import '@fontsource/noto-sans-kr/400.css';
import '@fontsource/noto-sans-kr/700.css';
import { type ReactNode } from 'react';
import './cesium.css';
// import { Cesium } from './features';
import './tailwind.css';
import { Storybook } from './Storybook';

function App(): ReactNode {
  // return <Cesium />;
  // return <CesiumBuilding />;
  return <Storybook />;
}

export default App;
