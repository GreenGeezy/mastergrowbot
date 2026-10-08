import { build } from 'vite';
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

await build({ build: { ssr: 'src/entry-server.tsx', outDir: 'dist-ssr', rollupOptions: { output: { manualChunks: undefined } } }, ssr: { noExternal: ['react-helmet-async'] } });
const { publicRoutes, render } = await import(pathToFileURL(path.resolve('dist-ssr/entry-server.js')).href);
const candidate = await readFile('dist/index.html', 'utf8');
const shell = candidate.includes('data-prerendered') ? await readFile('dist/client.html', 'utf8') : candidate;
const css = (await readdir('dist/assets')).filter(f => f.endsWith('.css') && !shell.includes(`/assets/${f}`)).map(f => `<link rel="stylesheet" href="/assets/${f}">`).join('');
if (/rel="canonical"/.test(shell)) throw new Error('Shared shell cannot declare a canonical');
await writeFile('dist/client.html', shell);
const config = JSON.parse(await readFile('vercel.json', 'utf8'));
const redirected = new Set(config.redirects.map(r => r.source));
const redirects = config.redirects.find(r => r.source.startsWith('/grow-guides/:slug('))?.source.match(/\((.*)\)/)?.[1].split('|') ?? [];
const routes = publicRoutes.filter(r => !redirected.has(r) && !redirects.includes(r.split('/').pop()));
const sitemap = await readFile('public/sitemap.xml', 'utf8');
for (const route of routes) {
  if (!config.rewrites.some(r => r.source === route && r.destination === (route === '/' ? '/index.html' : `/seo${route}.html`))) throw new Error(`Missing production rewrite: ${route}`);
  const url = `https://www.mastergrowbot.com${route}`;
  const { body, head } = await render(route);
  if (body.includes('data-msg=')) throw new Error(`Server rendering failed: ${route}`);
  if (!/<h1[\s>]/.test(body) || !head.includes(`href="${url}"`)) throw new Error(`Missing H1/canonical: ${route}`);
  if ((head.match(/rel="canonical"/g) ?? []).length !== 1) throw new Error(`Conflicting canonical: ${route}`);
  const html = shell.replace(/<title>[\s\S]*?<\/title>/, '').replace(/<meta[^>]*data-rh="true"[^>]*>/g, '').replace(/<meta[^>]*name="title"[^>]*>/g, '')
    .replace('</head>', `${head}${css}</head>`).replace('<div id="root"></div>', `<div id="root" data-prerendered="true">${body}</div>`);
  const destination = route === '/' ? 'dist/index.html' : `dist/seo${route}.html`;
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, html);
  if (!sitemap.includes(`<loc>${url}</loc>`)) console.warn(`Existing sitemap omission requires quality review: ${url}`);
}
await writeFile('dist/public-routes.json', JSON.stringify(routes));
await writeFile('dist/404.html', '<!doctype html><html lang="en"><head><meta name="robots" content="noindex"><title>Page not found | MasterGrowbot</title></head><body><h1>Page not found</h1><a href="/">Return to MasterGrowbot</a></body></html>');
console.log(`Statically rendered ${routes.length} public routes. Private routes use the client shell.`);
