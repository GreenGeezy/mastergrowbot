import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// Run explicitly after production verification, never during preview/build.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const origin = 'https://www.mastergrowbot.com';
const key = (await readFile(resolve(root, 'public/indexnow-key.txt'), 'utf8')).trim();
const sitemap = await readFile(resolve(root, 'public/sitemap.xml'), 'utf8');
const allowed = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]));
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const urls = [...new Set(args.filter(arg => arg !== '--dry-run'))];
if (!urls.length || urls.length > 20) throw new Error('Provide 1-20 explicitly changed, published sitemap URLs.');
if (!/^[a-zA-Z0-9-]{8,128}$/.test(key)) throw new Error('Invalid public IndexNow ownership key.');
for (const value of urls) {
  const url = new URL(value);
  if (url.origin !== origin || url.search || url.hash || !allowed.has(value)) {
    throw new Error(`Only exact public production sitemap URLs are permitted: ${value}`);
  }
}
const payload = { host: new URL(origin).host, key, keyLocation: `${origin}/indexnow-key.txt`, urlList: urls };
if (dryRun) {
  console.log(JSON.stringify({ dryRun: true, ...payload }, null, 2));
} else {
  const fetchChecked = async (url) => {
    const response = await fetch(url, { redirect: 'error', signal: AbortSignal.timeout(30000) });
    if (response.status !== 200) throw new Error(`${url}: HTTP ${response.status}`);
    return response;
  };
  const keyResponse = await fetchChecked(payload.keyLocation);
  if ((await keyResponse.text()).trim() !== key) throw new Error('Ownership key has not deployed.');
  const productionSitemap = await (await fetchChecked(`${origin}/sitemap.xml`)).text();
  for (const url of urls) {
    if (!productionSitemap.includes(`<loc>${url}</loc>`)) throw new Error(`Missing from production sitemap: ${url}`);
    const response = await fetchChecked(url);
    const html = await response.text();
    if (!response.headers.get('content-type')?.includes('text/html') || /noindex/i.test(response.headers.get('x-robots-tag') || '') || /<meta[^>]+content=["'][^"']*noindex/i.test(html)) {
      throw new Error(`Page failed public HTML/indexability preflight: ${url}`);
    }
  }
  const response = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST', headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(payload), signal: AbortSignal.timeout(30000),
  });
  const result = { submittedAt: new Date().toISOString(), urls, status: response.status,
    result: response.status === 200 ? 'accepted' : response.status === 202 ? 'received; ownership verification pending' : 'failed',
    indexingGuaranteed: false };
  const stateDir = resolve(root, '../organic-growth-state');
  await mkdir(stateDir, { recursive: true });
  await writeFile(resolve(stateDir, `indexnow-${Date.now()}.json`), JSON.stringify(result, null, 2) + '\n');
  console.log(JSON.stringify(result, null, 2));
  if (![200, 202].includes(response.status)) process.exitCode = 1;
}
