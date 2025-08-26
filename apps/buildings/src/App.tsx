import '@monorepo/shared/cesium.css';
import { type ReactNode } from 'react';
import { CookiesTemplates } from './_templates/CookiesTemplates';
import { RouterProviderTemplates } from './_templates/routes';
import './App.css';

function App(): ReactNode {
  return <CookiesTemplates children={<RouterProviderTemplates />} />;
}

export default App;
