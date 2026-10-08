import { test, expect } from 'playwright/test';
const lens = '/grow-tech/apexel-macro-lens-kit';
test('important pages expose content and one canonical before JavaScript', async ({ request }) => {
  for (const route of ['/', '/about', '/playbooks', '/grow-tech', lens, '/vpd-calculator', '/grow-guides', '/grow-guides/best-ai-cannabis-growing-apps-2026']) {
    const response = await request.get(route);
    expect(response.status(), route).toBe(200);
    const html = await response.text();
    expect(html, route).toMatch(/<h1[\s>]/);
    expect(html.match(/rel="canonical"/g), route).toHaveLength(1);
    expect(html, route).toContain(`href="https://www.mastergrowbot.com${route}"`);
    expect(html, route).not.toContain('data-msg=');
  }
  expect((await request.get('/definitely-missing-page')).status()).toBe(404);
  const checkout = await (await request.get('/grow-tech/checkout/scout-guide-bundle')).text();
  expect(checkout).not.toMatch(/rel="canonical"|data-prerendered/);
});
test('lens offer matches visible price, honest delivery and product schema', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', msg => { if (msg.type() === 'error' && /hydrat|#4(18|23|25)/i.test(msg.text())) errors.push(msg.text()); });
  await page.goto(lens);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('APEXEL 10–20X macro lens kit');
  await expect(page.locator('main')).toContainText('2–4 weeks from payment');
  const schemas = (await page.locator('script[type="application/ld+json"]').allTextContents()).map(s => JSON.parse(s));
  const product = schemas.find(s => s['@type'] === 'Product');
  expect(product.offers.price).toBe(119);
  expect(product.offers.shippingDetails).toBeUndefined();
  expect(product.aggregateRating).toBeUndefined();
  expect(schemas.some(s => s['@type'] === 'BreadcrumbList')).toBe(true);
  await expect(page.locator('[data-section="growtech-testimonials"] blockquote')).toHaveCount(3);
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('link', { name: 'Get the lens + guide — $119', exact: true }).first().click();
  await expect(page).toHaveURL(/\/grow-tech\/checkout\/scout-guide-bundle$/);
  await expect(page.locator('h1')).toBeVisible();
  expect(errors).toEqual([]);
});
test('client navigation preserves canonical and campaign labels without internal UTMs', async ({ page }) => {
  await page.goto('/grow-guides/best-cannabis-trichome-camera-lens-options-harvest-timing?utm_source=partner&utm_medium=referral&utm_campaign=real_source');
  await expect(page.locator('article')).toBeVisible();
  await page.locator('a[href="'+lens+'"]').first().click();
  await expect(page).toHaveURL(new RegExp(lens+'$'));
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://www.mastergrowbot.com'+lens);
  const stored = await page.evaluate(() => JSON.parse(sessionStorage.getItem('mastergrowbot.growtech.campaign.v1') || '{}'));
  expect(stored.campaign.utm_source).toBe('partner');
  expect(stored.campaign.utm_campaign).toBe('real_source');
});

test('primary AI app guide keeps mobile store CTAs and one attributed event per click', async ({ page }) => {
  const route = '/grow-guides/best-ai-cannabis-growing-apps-2026';
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(route);
  await expect(page.locator('#app-preview')).toBeVisible();
  await page.evaluate(() => {
    window.dataLayer = [];
    window.gtag = (...args: unknown[]) => window.dataLayer!.push(args);
    document.addEventListener('click', e => e.preventDefault(), true);
  });
  for (const platform of ['ios', 'android']) {
    await page.locator(`[data-cta-location="article-product-preview:${platform}"]`).click();
  }
  const events = await page.evaluate(() => window.dataLayer);
  expect(events).toEqual([
    ['event', 'ios_app_click', expect.objectContaining({ page_path: route, article_slug: 'best-ai-cannabis-growing-apps-2026', cta_location: 'article-product-preview:ios' })],
    ['event', 'android_app_click', expect.objectContaining({ page_path: route, cta_location: 'article-product-preview:android' })],
  ]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});
