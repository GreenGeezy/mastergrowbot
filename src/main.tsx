import { createRoot, hydrateRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { publicPageKey, publicPageLoaders } from './lib/publicRoutes';
import './index.css';
async function startApp() {
  const root = document.getElementById('root');
  if (!root) throw new Error('Missing root element');
  const key = publicPageKey(window.location.pathname);
  const initialPage = key ? { key, component: (await publicPageLoaders[key]()).default } : undefined;
  const app = <HelmetProvider><BrowserRouter><App initialPage={initialPage} /></BrowserRouter></HelmetProvider>;
  if (root.dataset.prerendered === 'true') hydrateRoot(root, app);
  else createRoot(root).render(app);
}
void startApp();
