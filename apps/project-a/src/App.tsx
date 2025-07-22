import type { ReactNode } from 'react';
import { Cesium } from './components/Cesium/Cesium';
import './App.css';

function App(): ReactNode {
  return (
    <div className='absolute'>
      <Cesium />
    </div>
  );
}

export default App;
