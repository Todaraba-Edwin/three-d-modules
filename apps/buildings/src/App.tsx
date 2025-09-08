import '@monorepo/shared/cesium.css';
import { type ReactNode } from 'react';
import { CookiesTemplates } from './_templates/CookiesTemplates';
import './App.css';
import { RouterProviderTemplates } from './_templates/RouterProviderTemplates';

function App(): ReactNode {
  return <CookiesTemplates children={<RouterProviderTemplates />} />;
}

export default App;
