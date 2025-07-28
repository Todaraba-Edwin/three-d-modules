import '@monorepo/shared/cesium.css';
import { type ReactNode } from 'react';
import { RouterProviderTemplates } from './_templates/routes';
import './App.css';

function App(): ReactNode {
  return <RouterProviderTemplates />;
}

export default App;
