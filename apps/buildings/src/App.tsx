import '@monorepo/shared/cesium.css';
import { type ReactNode } from 'react';
import { CookiesTemplates } from './_templates/CookiesTemplates';
import { QueryProviderTemplates } from './_templates/QueryProviderTemplates';
import { RouterProviderTemplates } from './_templates/RouterProviderTemplates';
import './App.css';

function App(): ReactNode {
  return (
    <CookiesTemplates>
      <QueryProviderTemplates>
        <RouterProviderTemplates />
      </QueryProviderTemplates>
    </CookiesTemplates>
  );
}

export default App;
