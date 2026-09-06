import { build } from 'esbuild';
import { unlink } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const outfile = path.resolve('scripts/.guide-render-fixture.mjs');
try {
  await build({
    stdin: { contents: `import {createElement} from 'react';
      import {renderToStaticMarkup} from 'react-dom/server';
      import GuideContent from './src/components/GuideContent';
      import {growGuides} from './src/data/growGuides';
      const texts = growGuides.flatMap(g => [g.intro, ...g.sections.map(s => s.bodyHtml ?? s.body ?? '')]);
      const render = text => renderToStaticMarkup(createElement(GuideContent, null, text));
      export const html = texts.map(render).join('');
      export const unsafe = render('<script>alert(1)</script><img src="x" onerror="alert(1)"><a href="javascript:alert(1)">bad</a> [unsafe](javascript:alert%281%29)');`, resolveDir: process.cwd() },
    bundle: true, packages: 'external', platform: 'node', format: 'esm', jsx: 'automatic',
    alias: { '@': path.resolve('src') }, outfile,
  });
  const result = await import(pathToFileURL(outfile).href);
  process.stdout.write(JSON.stringify({html: result.html, unsafe: result.unsafe}));
} finally {
  await unlink(outfile).catch(() => {});
}
