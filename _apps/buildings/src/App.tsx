import '@monorepo/shared/cesium.css';
import { type ReactNode } from 'react';
import * as Temp from './_templates';
import './font.css';
import './App.css';

function App(): ReactNode {
  return (
    <Temp.CookiesTemplates
      children={
        <Temp.QueryProviderTemplates
          children={<Temp.RouterProviderTemplates />}
        />
      }
    />
  );
}

export default App;
