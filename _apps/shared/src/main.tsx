import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { QueryProviderTemplates } from './components/QueryProviderTemplates.tsx';

createRoot(document.getElementById('root')!).render(
  <QueryProviderTemplates>
    <App />
  </QueryProviderTemplates>
);
