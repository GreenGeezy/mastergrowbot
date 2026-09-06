import { test, expect } from 'playwright/test';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const slug = 'best-cannabis-grow-journal-apps-2026';
const target = `/grow-guides/${slug}`;

test('all guide strings render links without executable HTML', async ({ page }) => {
  const {html, unsafe: safe} = JSON.parse(execFileSync(process.execPath, ['scripts/render-guide-fixtures.mjs'], {encoding: 'utf8', maxBuffer: 10 * 1024 * 1024}));
  await page.setContent(html, {waitUntil: 'domcontentloaded'});
  expect((await page.locator('body').innerText()).match(/\[[^\]\n]+\]\([^)\n]+\)/)).toBeNull();
  await expect(page.locator('a[href^="/grow-guides/"]').first()).toBeAttached();
  expect(safe).not.toMatch(/<script|onerror=|href="javascript:/i);
});

test('shared shell has no canonical or unverified aggregate rating', () => {
  const shell = readFileSync('index.html', 'utf8');
  expect(shell).not.toMatch(/rel="canonical"|aggregateRating|ratingCount/);
});

test('shared shell contains one exact Whop Pixel with narrowly scoped CSP access', () => {
  const shell = readFileSync('index.html', 'utf8');
  const snippet = '<script>!function(w,d,s,u,n,a,b){if(w[n])return;a=w[n]={q:[],t:+new Date,s:[],o:u,track:function(){a.q.push([+new Date].concat([].slice.call(arguments)))},setScope:function(){a.s=[].slice.call(arguments).filter(function(x){return typeof x==="string"});a.q.push([+new Date,"setScope"].concat(a.s))},scope:function(){var c=[].slice.call(arguments);return{track:function(){a.q.push([+new Date].concat([].slice.call(arguments)).concat([{__scope:c}]))}}}};b=d.createElement(s);b.async=1;b.src=u+"/s.js";d.getElementsByTagName(s)[0].parentNode.insertBefore(b,d.getElementsByTagName(s)[0])}(window,document,"script","https://t.whop.tw","whop");whop.setScope("biz_8m5fp7bUlZOdVX");whop.track("page");</script>';

  expect(shell.split(snippet)).toHaveLength(2);
  expect(shell.match(/https:\/\/t\.whop\.tw\/s\.js/g)).toBeNull();
  expect(shell).toMatch(/script-src[^;]*https:\/\/t\.whop\.tw;/);
  expect(shell).toMatch(/connect-src[^;]*https:\/\/t\.whop\.tw[^;]*;/s);
});

test('home, hub and target have one correct canonical, including client navigation', async ({ page }) => {
  for (const path of ['/', '/grow-guides', target]) {
    await page.goto(path);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://www.mastergrowbot.com${path}`);
  }
  await page.getByRole('link', { name: '← All Grow Guides', exact: true }).click();
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://www.mastergrowbot.com/grow-guides');
});

test('target has correct content, links, schema and mobile layout', async ({ page, request }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const response = await page.goto(target);
  expect(response?.status()).toBe(200);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Cannabis Grow Journal Apps: How to Choose in 2026');
  const article = page.locator('article');
  expect(await article.innerText()).not.toMatch(/\[[^\]\n]+\]\([^)\n]+\)|15-25%|78%|23%|After testing|Rated 5 Stars/);
  const scripts = await page.locator('script[type="application/ld+json"]').allTextContents();
  const schemas = scripts.map(s => JSON.parse(s));
  expect(schemas.find(s => s['@type'] === 'Article')?.dateModified).toContain('2026-09-06');
  expect(schemas.some(s => s['@type'] === 'BreadcrumbList')).toBe(true);
  expect(await page.locator('meta[name="robots"]').evaluateAll(nodes => nodes.map(n => n.getAttribute('content')).join(' '))).not.toMatch(/noindex/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const links = await article.locator('.guide-content a[href^="/"]').evaluateAll(nodes => nodes.map(n => n.getAttribute('href')!));
  for (const href of new Set(links)) expect((await request.get(href)).status(), href).toBe(200);
  await expect(page.locator('[data-cta-location="article-inline:ios"]')).toHaveAttribute('href', /apps.apple.com/);
  await expect(page.locator('[data-cta-location="article-inline:android"]')).toHaveAttribute('href', /id=com.mastergrowbot.app&/);
});

test('store events fire once with article and CTA context', async ({ page }) => {
  await page.goto(target);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.evaluate(() => {
    (window as unknown as { captured: unknown[][] }).captured = [];
    window.gtag = (...args: unknown[]) => (window as unknown as { captured: unknown[][] }).captured.push(args);
    document.addEventListener('click', e => e.preventDefault(), true);
  });
  await page.locator('[data-cta-location="article-inline:ios"]').click();
  await page.locator('[data-cta-location="article-inline:android"]').click();
  const events = await page.evaluate(() => (window as unknown as { captured: unknown[][] }).captured);
  expect(events).toHaveLength(2);
  expect(events[0]).toEqual(['event', 'ios_app_click', expect.objectContaining({ article_slug: slug, page_path: target, cta_location: 'article-inline:ios' })]);
  expect(events[1]).toEqual(['event', 'android_app_click', expect.objectContaining({ article_slug: slug, cta_location: 'article-inline:android' })]);
});
