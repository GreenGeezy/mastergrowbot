import { build } from 'esbuild';
import { readFile, writeFile, mkdir, unlink } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

// Deliver canonical identity before JavaScript runs. Helmet owns these same
// tags after rendering, including navigation to another route.
const bundle = path.resolve('scripts/.route-head-data.mjs');
const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
try {
  await build({ entryPoints: ['src/data/growGuides.ts'], outfile: bundle,
    bundle: true, platform: 'node', format: 'esm', alias: { '@': path.resolve('src') } });
  const { growGuides } = await import(pathToFileURL(bundle).href);
  const routes = growGuides.map(guide => ({ route: `/grow-guides/${guide.slug}`, title: guide.metaTitle, description: guide.metaDescription }));
  for (const [route, file] of [['/grow-tech', 'GrowTech'], ['/grow-guides', 'GrowGuidesHub'], ['/vpd-calculator', 'VPDCalculator']]) {
    const source = await readFile(`src/pages/${file}.tsx`, 'utf8');
    const head = source.match(/<SEOHead\s+title="([^"]+)"\s+description="([^"]+)"\s+canonicalUrl="([^"]+)"/);
    if (!head || head[3] !== `https://www.mastergrowbot.com${route}`) throw new Error(`Missing matching route metadata: ${route}`);
    routes.push({ route, title: head[1], description: head[2] });
  }
  const shell = await readFile('dist/index.html', 'utf8');
  if (/rel="canonical"/.test(shell)) throw new Error('Shared fallback must not declare a canonical');
  for (const { route, title, description } of routes) {
    if (!/^\/[a-z0-9/-]+$/.test(route)) throw new Error(`Unsafe route: ${route}`);
    const destination = `dist/seo${route}.html`;
    await mkdir(path.dirname(destination), { recursive: true });
    const html = shell.replace(/<title>[\s\S]*?<\/title>/, `<title>${escape(title)}</title>`)
      .replace(/<meta[^>]*name="description"[^>]*>/, `<meta data-rh="true" name="description" content="${escape(description)}" />`)
      .replace('</head>', `<link data-rh="true" rel="canonical" href="https://www.mastergrowbot.com${route}" />\n</head>`);
    await writeFile(destination, html);
  }
  console.log(`Generated initial canonical and metadata for ${routes.length} public routes.`);
} finally {
  await unlink(bundle).catch(() => {});
}
