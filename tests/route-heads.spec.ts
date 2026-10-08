import { test, expect } from 'playwright/test';
import { readFileSync } from 'node:fs';

const routes = ['/grow-tech', '/grow-guides', '/vpd-calculator', '/grow-guides/best-ai-plant-diagnosis-apps-cannabis'];

test('built public routes provide one initial canonical and preserve the application shell', () => {
  const fallback = readFileSync('dist/client.html', 'utf8');
  expect(fallback).not.toContain('rel="canonical"');
  for (const route of routes) {
    const html = readFileSync(`dist/seo${route}.html`, 'utf8');
    expect(html.match(/rel="canonical"/g)).toHaveLength(1);
    expect(html).toContain(`data-rh="true" rel="canonical" href="https://www.mastergrowbot.com${route}"`);
    expect(html).toContain('ios_app_click');
    expect(html).toContain('android_app_click');
    expect(html).toContain('id="root"');
    expect(html).toMatch(/src="\/assets\/index-[^"]+\.js"/);
  }
});

test('initial canonical remains unique and follows client navigation', async ({ page }) => {
  await page.route('**/grow-tech', async route => {
    if (route.request().isNavigationRequest()) await route.fulfill({ contentType: 'text/html', body: readFileSync('dist/seo/grow-tech.html', 'utf8') });
    else await route.continue();
  });
  await page.route('**/assets/**', async route => {
    const file = new URL(route.request().url()).pathname;
    await route.fulfill({ contentType: file.endsWith('.css') ? 'text/css' : 'text/javascript', body: readFileSync(`dist${file}`) });
  });
  await page.goto('/grow-tech');
  await expect(page.locator('[data-section="growtech-testimonials"] blockquote').first()).toBeVisible();
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
  await page.getByRole('link', { name: 'Grow Guides', exact: true }).first().click();
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://www.mastergrowbot.com/grow-guides');
});
