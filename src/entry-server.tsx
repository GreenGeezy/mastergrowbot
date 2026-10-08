import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import { publicPageKey, publicPageLoaders, staticPublicRoutes } from './lib/publicRoutes';
import { growGuides } from './data/growGuides';
export const publicRoutes = [...Object.keys(staticPublicRoutes), ...growGuides.map(g => `/grow-guides/${g.slug}`)];
export async function render(route: string) {
  const key = publicPageKey(route);
  if (!key) throw new Error(`Not a public route: ${route}`);
  const initialPage = { key, component: (await publicPageLoaders[key]()).default };
  const context: Record<string, unknown> = {};
  const body = renderToString(<HelmetProvider context={context}><StaticRouter location={route}><App initialPage={initialPage} /></StaticRouter></HelmetProvider>);
  const helmet = context.helmet as { title: { toString(): string }; meta: { toString(): string }; link: { toString(): string }; script: { toString(): string } };
  return { body, head: helmet.title.toString() + helmet.meta.toString() + helmet.link.toString() + helmet.script.toString() };
}
