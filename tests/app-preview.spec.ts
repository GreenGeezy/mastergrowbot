import { test, expect } from 'playwright/test';

const route = '/grow-guides/best-ai-cannabis-growing-apps-2026';
test('product preview preserves campaign labels and emits one existing event per click', async ({ page }) => {
  await page.goto(`${route}?utm_source=linkedin&utm_medium=social&utm_campaign=october&email=private@example.com`);
  const preview = page.locator('#app-preview');
  await expect(preview).toBeVisible();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://www.mastergrowbot.com${route}`);
  await expect(preview.getByRole('img')).toBeVisible();
  for (const platform of ['ios', 'android']) {
    const link = preview.locator(`[data-cta-location="article-product-preview:${platform}"]`);
    const href = await link.getAttribute('href');
    expect(href).toContain('utm_source=linkedin');
    expect(href).not.toContain('private');
    expect(href).not.toContain('email=');
    await page.evaluate(() => {
      window.dataLayer = [];
      document.addEventListener('click', e => e.preventDefault(), { once: true });
    });
    await link.click();
    const events = await page.evaluate(() => (window.dataLayer || []).map((x: any) => Array.from(x)));
    const matches = events.filter((x: any) => x[1] === `${platform === 'ios' ? 'ios' : 'android'}_app_click`);
    expect(matches).toHaveLength(1);
    expect(matches[0][2]).toMatchObject({ article_slug: route.split('/').pop(), cta_location: `article-product-preview:${platform}` });
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(preview.getByRole('link', { name: 'View on the iPhone App Store' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await preview.screenshot({ path: 'output/playwright/product-preview-mobile.png' });
  await page.setViewportSize({ width: 1280, height: 900 });
  await preview.screenshot({ path: 'output/playwright/product-preview-desktop.png' });
});

test('preview is limited to the selected guide and falls back for unsafe campaign values', async ({ page }) => {
  await page.goto(`${route}?utm_source=user%40example.com`);
  await expect(page.locator('#app-preview a[data-cta-location$=ios]')).toHaveAttribute('href', /utm_source=website/);
  await page.goto('/grow-guides/best-cannabis-growing-apps-2026');
  await expect(page.locator('#app-preview')).toHaveCount(0);
});
