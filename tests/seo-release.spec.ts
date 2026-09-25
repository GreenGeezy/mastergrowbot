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

test('Grow Tech is discoverable, commercially described and free of expired promotion copy', async ({ page }) => {
  const sitemap = readFileSync('public/sitemap.xml', 'utf8');
  expect(sitemap).toContain('<loc>https://www.mastergrowbot.com/grow-tech</loc>');

  await page.goto('/grow-tech');
  await expect(page.locator('meta[name="description"]')).toHaveCount(1);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /cannabis grow tech kit/i);
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/Know your grow\.\s*Inside and out\./);
  await expect(page.locator('body')).not.toContainText(/Best July Deal|AIGROWTECH|July sale price/);
  await expect(page.locator('#grow-tech-kit')).toContainText('$247');

  const schemaScripts = await page.locator('script[type="application/ld+json"]').allTextContents();
  const graph = schemaScripts.map((script) => JSON.parse(script)).find((schema) => Array.isArray(schema['@graph']))['@graph'];
  const products = graph.filter((entry: { '@type'?: string }) => entry['@type'] === 'Product');
  expect(products).toHaveLength(4);
  expect(products.every((product: { '@id'?: string }) => product['@id']?.startsWith('https://www.mastergrowbot.com/grow-tech#'))).toBe(true);
  expect(products.every((product: { offers?: { hasMerchantReturnPolicy?: { returnFees?: string } } }) =>
    product.offers?.hasMerchantReturnPolicy?.returnFees === 'https://schema.org/ReturnFeesCustomerResponsibility'
  )).toBe(true);
  expect(graph.some((entry: { '@type'?: string }) => entry['@type'] === 'CollectionPage')).toBe(true);
});

test('hardware-intent guides recommend the matching Grow Tech product', async ({ page }) => {
  await page.goto('/grow-guides/best-cannabis-grow-room-sensors-mold-heat-stress');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Grow Room Sensors for Cannabis: Environment Monitor Guide');
  expect(await page.title()).toMatch(/Grow Room Sensors for Cannabis/);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /environment monitor/i);
  await expect(page.getByRole('heading', { name: 'Direct Answer: Best Grow Room Sensor Setup' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'free cannabis VPD calculator' }).first()).toHaveAttribute('href', '/vpd-calculator');
  const cta = page.locator('[data-cta-location="article-inline:grow-tech"]');
  await expect(cta).toHaveAttribute('href', '/grow-tech#environment-monitor');
  await expect(cta).toContainText('Compare price & details');
  const schemas = (await page.locator('script[type="application/ld+json"]').allTextContents()).map(s => JSON.parse(s));
  expect(schemas.find(s => s['@type'] === 'Article')?.dateModified).toContain('2026-09-21');
  await expect(page.locator('article')).not.toContainText(/yield, potency/);
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

test('VPD calculator targets high-volume search intent and tracks app CTAs', async ({ page, request }) => {
  await page.goto('/vpd-calculator');
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://www.mastergrowbot.com/vpd-calculator');
  expect(await page.title()).toMatch(/VPD Calculator: Free Leaf VPD Chart/);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /free VPD calculator/i);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('VPD Calculator: Free Leaf VPD and Chart for Cannabis');
  await expect(page.getByRole('heading', { name: 'Calculate VPD from temperature and humidity, then compare it to your stage target.' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'VPD guide' })).toHaveAttribute('href', '/grow-guides/cannabis-vpd-guide');
  await expect(page.getByRole('link', { name: 'Leaf VPD explainer' })).toHaveAttribute('href', '/grow-guides/leaf-vpd-calculator-cannabis');
  await expect(page.getByRole('link', { name: 'VPD calculator apps' })).toHaveAttribute('href', '/grow-guides/best-vpd-calculator-apps-cannabis');
  await expect(page.getByRole('link', { name: 'Environment monitor kit' })).toHaveAttribute('href', '/grow-tech#environment-monitor');

  for (const href of ['/grow-guides/cannabis-vpd-guide', '/grow-guides/leaf-vpd-calculator-cannabis', '/grow-guides/best-vpd-calculator-apps-cannabis', '/grow-tech']) {
    expect((await request.get(href)).status(), href).toBe(200);
  }

  await page.evaluate(() => {
    (window as unknown as { captured: unknown[][] }).captured = [];
    window.gtag = (...args: unknown[]) => (window as unknown as { captured: unknown[][] }).captured.push(args);
    document.addEventListener('click', e => e.preventDefault(), true);
  });
  await page.locator('[data-cta-location="vpd-calculator-results:ios"]').click();
  await page.locator('[data-cta-location="vpd-calculator-results:android"]').click();
  const events = await page.evaluate(() => (window as unknown as { captured: unknown[][] }).captured);
  expect(events).toHaveLength(2);
  expect(events[0]).toEqual(['event', 'ios_app_click', expect.objectContaining({ page_path: '/vpd-calculator', cta_location: 'vpd-calculator-results:ios', link_url: expect.stringContaining('apps.apple.com') })]);
  expect(events[1]).toEqual(['event', 'android_app_click', expect.objectContaining({ page_path: '/vpd-calculator', cta_location: 'vpd-calculator-results:android', link_url: expect.stringContaining('play.google.com') })]);
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

test('cultivation software guide has updated checklist, schema date and body CTA tracking', async ({ page }) => {
  const cultivationTarget = '/grow-guides/best-cannabis-cultivation-software-home-growers';
  await page.goto(cultivationTarget);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Best Cannabis Cultivation Software');
  await expect(page.getByRole('heading', { name: 'Software Selection Checklist Before You Subscribe' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Source Notes and Current Product Pages' })).toBeVisible();
  const schemas = (await page.locator('script[type="application/ld+json"]').allTextContents()).map(s => JSON.parse(s));
  expect(schemas.find(s => s['@type'] === 'Article')?.dateModified).toContain('2026-09-08');

  await page.evaluate(() => {
    (window as unknown as { captured: unknown[][] }).captured = [];
    window.gtag = (...args: unknown[]) => (window as unknown as { captured: unknown[][] }).captured.push(args);
    document.addEventListener('click', e => e.preventDefault(), true);
  });
  await page.locator('[data-cta-location="article-body:ios"]').first().click();
  await page.locator('[data-cta-location="article-body:android"]').first().click();
  const events = await page.evaluate(() => (window as unknown as { captured: unknown[][] }).captured);
  expect(events).toHaveLength(2);
  expect(events[0]).toEqual(['event', 'ios_app_click', expect.objectContaining({ article_slug: 'best-cannabis-cultivation-software-home-growers', page_path: cultivationTarget, cta_location: 'article-body:ios', link_url: expect.stringContaining('apps.apple.com') })]);
  expect(events[1]).toEqual(['event', 'android_app_click', expect.objectContaining({ article_slug: 'best-cannabis-cultivation-software-home-growers', cta_location: 'article-body:android', link_url: expect.stringContaining('play.google.com') })]);
});

test('AI plant diagnosis guide targets rising diagnosis-app intent', async ({ page, request }) => {
  const diagnosisTarget = '/grow-guides/best-ai-plant-diagnosis-apps-cannabis';
  await page.goto(diagnosisTarget);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://www.mastergrowbot.com${diagnosisTarget}`);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Best AI Plant Diagnosis Apps for Cannabis Growers');
  expect(await page.title()).toMatch(/Best AI Plant Diagnosis Apps/);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /AI plant diagnosis apps for cannabis growers/i);
  await expect(page.getByRole('heading', { name: 'Direct Answer: Best AI Plant Diagnosis App for Cannabis' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'How to Choose an AI Plant Diagnosis App' })).toBeVisible();
  await expect(page.locator('article')).toContainText('guidance, not certainty');

  const schemas = (await page.locator('script[type="application/ld+json"]').allTextContents()).map(s => JSON.parse(s));
  expect(schemas.find(s => s['@type'] === 'Article')?.dateModified).toContain('2026-09-23');
  for (const href of [
    '/grow-tech',
    '/grow-guides/cannabis-plant-identifier-apps-2026',
    '/grow-guides/best-ai-cannabis-growing-apps-2026',
    '/grow-guides/best-cannabis-cultivation-software-home-growers',
    '/vpd-calculator',
  ]) {
    expect((await request.get(href)).status(), href).toBe(200);
  }

  await page.evaluate(() => {
    (window as unknown as { captured: unknown[][] }).captured = [];
    window.gtag = (...args: unknown[]) => (window as unknown as { captured: unknown[][] }).captured.push(args);
    document.addEventListener('click', e => e.preventDefault(), true);
  });
  await page.locator('[data-cta-location="article-inline:ios"]').click();
  await page.locator('[data-cta-location="article-inline:android"]').click();
  const events = await page.evaluate(() => (window as unknown as { captured: unknown[][] }).captured);
  expect(events).toHaveLength(2);
  expect(events[0]).toEqual(['event', 'ios_app_click', expect.objectContaining({ article_slug: 'best-ai-plant-diagnosis-apps-cannabis', page_path: diagnosisTarget, cta_location: 'article-inline:ios', link_url: expect.stringContaining('apps.apple.com') })]);
  expect(events[1]).toEqual(['event', 'android_app_click', expect.objectContaining({ article_slug: 'best-ai-plant-diagnosis-apps-cannabis', cta_location: 'article-inline:android', link_url: expect.stringContaining('play.google.com') })]);
});

test('plant identifier guide targets app-comparison intent with safer claims', async ({ page, request }) => {
  const identifierTarget = '/grow-guides/cannabis-plant-identifier-apps-2026';
  await page.goto(identifierTarget);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://www.mastergrowbot.com${identifierTarget}`);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Best Cannabis Plant Identifier Apps for AI Photo Diagnosis');
  expect(await page.title()).toMatch(/Cannabis Plant Identifier Apps/);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /AI photo diagnosis/i);
  await expect(page.getByRole('heading', { name: 'Direct Answer: Best Cannabis Plant Identifier App' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'How to Choose an AI Plant Identifier App' })).toBeVisible();
  await expect(page.locator('article')).toContainText('the result as guidance');
  await expect(page.locator('article')).not.toContainText(/85|90|95|Gemini 3\.1|tested dozens|treatment protocols/i);

  const schemas = (await page.locator('script[type="application/ld+json"]').allTextContents()).map(s => JSON.parse(s));
  expect(schemas.find(s => s['@type'] === 'Article')?.dateModified).toContain('2026-09-25');
  for (const href of [
    '/grow-guides/best-ai-plant-diagnosis-apps-cannabis',
    '/grow-guides/best-ai-plant-cameras-cannabis-growers-2026',
    '/grow-guides/cannabis-nutrient-deficiency-guide',
    '/vpd-calculator',
  ]) {
    expect((await request.get(href)).status(), href).toBe(200);
  }

  await page.evaluate(() => {
    (window as unknown as { captured: unknown[][] }).captured = [];
    window.gtag = (...args: unknown[]) => (window as unknown as { captured: unknown[][] }).captured.push(args);
    document.addEventListener('click', e => e.preventDefault(), true);
  });
  await page.locator('[data-cta-location="article-body:ios"]').first().click();
  await page.locator('[data-cta-location="article-body:android"]').first().click();
  const events = await page.evaluate(() => (window as unknown as { captured: unknown[][] }).captured);
  expect(events).toHaveLength(2);
  expect(events[0]).toEqual(['event', 'ios_app_click', expect.objectContaining({ article_slug: 'cannabis-plant-identifier-apps-2026', page_path: identifierTarget, cta_location: 'article-body:ios', link_url: expect.stringContaining('apps.apple.com') })]);
  expect(events[1]).toEqual(['event', 'android_app_click', expect.objectContaining({ article_slug: 'cannabis-plant-identifier-apps-2026', cta_location: 'article-body:android', link_url: expect.stringContaining('play.google.com') })]);
});
