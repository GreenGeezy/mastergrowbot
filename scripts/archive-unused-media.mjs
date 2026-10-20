import { readFileSync, readdirSync, statSync, mkdirSync, renameSync } from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const walk = dir => readdirSync(dir, {withFileTypes:true}).flatMap(e => e.isDirectory() ? walk(path.join(dir,e.name)) : [path.join(dir,e.name)]);
const sources = [...walk('src'), ...walk('scripts'), 'index.html', 'vercel.json'].filter(f=>/\.(tsx?|jsx?|mjs|css|html|json)$/.test(f)).map(f=>readFileSync(f,'utf8')).join('\n');
const candidates = walk('public/videos').filter(f => /(?:v6|v5|mastergrowbot-report-30s\.mp4)/.test(f) && !sources.includes(path.basename(f)));
for(const dir of ['public/images/grow-tech/lens-launch','public/images/grow-tech/soil-launch','public/images/grow-tech/tent-express-v2']) {
  for(const file of walk(dir)) if(file.endsWith('.png') && !sources.includes(file.replaceAll('\\','/').replace('public/',''))) candidates.push(file);
}
let total=0;
for(const relative of candidates) {
  const source=path.resolve(relative); const target=path.resolve('source-assets',relative.replace(/^public[\\/]/,''));
  if(!source.startsWith(root+path.sep)||!target.startsWith(root+path.sep)) throw Error('Asset outside workspace');
  total+=statSync(source).size; mkdirSync(path.dirname(target),{recursive:true}); renameSync(source,target);
}
console.log(JSON.stringify({archived:candidates,bytesRemovedFromPublic:total}));
