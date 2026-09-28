// Local, no-network catalogue check. Inspired by OpenSEO's focused audit workflow.
import { build } from 'esbuild';
import { readFile, writeFile, mkdir, unlink } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const state = resolve(root, '../organic-growth-state');
const output = resolve(state, 'catalog-audit.json');
const source = await readFile(resolve(root, 'src/data/growGuides.ts'), 'utf8');
const sitemap = await readFile(resolve(root, 'public/sitemap.xml'), 'utf8');
const fingerprint = createHash('sha256').update(source).update(sitemap).update(await readFile(fileURLToPath(import.meta.url))).digest('hex');
let previous;
try { previous = JSON.parse(await readFile(output, 'utf8')); } catch { /* First run */ }
if (previous?.fingerprint === fingerprint) {
  console.log(JSON.stringify({cached:true,createdAt:previous.createdAt,...previous.summary,report:output}));
} else {
  const temp = resolve(root, `scripts/.seo-catalog-${process.pid}.mjs`);
  try {
    await build({entryPoints:[resolve(root,'src/data/growGuides.ts')],bundle:true,platform:'node',format:'esm',alias:{'@':resolve(root,'src')},outfile:temp,logLevel:'silent'});
    const { growGuides } = await import(pathToFileURL(temp).href);
    const sitemapUrls = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]));
    const slugs = new Set(growGuides.map(g=>g.slug));
    const issues=[];
    const titles=new Map();
    const pages=growGuides.map(g=>{
      const url=`https://www.mastergrowbot.com/grow-guides/${g.slug}`;
      if(!sitemapUrls.has(url)) issues.push({slug:g.slug,type:'missing-sitemap-url'});
      if(!g.metaTitle?.trim()||!g.metaDescription?.trim()||!g.h1?.trim()) issues.push({slug:g.slug,type:'missing-metadata'});
      const title=g.metaTitle.trim().toLowerCase();
      if(titles.has(title)) issues.push({slug:g.slug,type:'duplicate-title',other:titles.get(title)});
      titles.set(title,g.slug);
      const text=[g.intro,...g.sections.map(s=>s.body??s.bodyHtml??'')].join('\n');
      const outgoing=[...new Set([...text.matchAll(/\/grow-guides\/([a-z0-9-]+)/g)].map(m=>m[1]).concat(g.relatedSlugs))];
      for(const target of outgoing) if(!slugs.has(target)) issues.push({slug:g.slug,type:'missing-guide-link',target});
      return {slug:g.slug,title:g.metaTitle,modifiedDate:g.modifiedDate,outgoing};
    });
    const summary={guides:pages.length,issues:issues.length,issueCounts:Object.fromEntries([...new Set(issues.map(i=>i.type))].map(type=>[type,issues.filter(i=>i.type===type).length]))};
    await mkdir(state,{recursive:true});
    await writeFile(output,JSON.stringify({createdAt:new Date().toISOString(),fingerprint,summary,issues,pages,limits:'Source-only catalogue checks. Not a live crawl, ranking report, security audit, or proof of rendered indexability.'},null,2)+'\n');
    console.log(JSON.stringify({cached:false,...summary,firstIssues:issues.slice(0,8),report:output}));
  } finally { await unlink(temp).catch(()=>{}); }
}
