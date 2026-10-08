import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
const config = JSON.parse(await readFile('vercel.json', 'utf8'));
const privateRoutes = /^\/(grow-tech\/(checkout\/[^/]+|thank-you)|playbooks\/(checkout|thank-you)|contact|privacy-policy|terms-of-service|auth\/.*|checkout-diagnostics|whop-embed-test|ai-strategy\/intake)$/;
const types = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json', '.xml': 'application/xml', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.pdf': 'application/pdf' };
createServer(async (req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  const redirect = config.redirects.find(r => r.source === pathname);
  if (redirect) { res.writeHead(308, { Location: redirect.destination }); res.end(); return; }
  const route = config.rewrites.find(r => r.source === pathname);
  const file = route?.destination ?? (privateRoutes.test(pathname) ? '/client.html' : pathname);
  const resolved = path.resolve('dist', '.' + file);
  if (!resolved.startsWith(path.resolve('dist') + path.sep)) { res.writeHead(404); res.end(); return; }
  try { const data = await readFile(resolved); res.writeHead(200, { 'Content-Type': types[path.extname(file)] ?? 'application/octet-stream' }); res.end(data); }
  catch { res.writeHead(404, { 'Content-Type': 'text/html' }); res.end(await readFile('dist/404.html')); }
}).listen(8090, '127.0.0.1', () => console.log('Built site at http://127.0.0.1:8090'));
