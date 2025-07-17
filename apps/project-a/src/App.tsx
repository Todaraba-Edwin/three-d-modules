// import { Cesium3DModules } from '@monorepo/shared';
import type { ReactNode } from 'react';
import './App.css';

function App(): ReactNode {
  return (
    <div>
      프로젝트 A
      <button onClick={() => {}} className='bg-main'>
        테스트버튼
      </button>
    </div>
  );
  // return <Cesium3DModules />;
}

export default App;
