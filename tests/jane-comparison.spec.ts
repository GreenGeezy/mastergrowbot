import { test, expect } from 'playwright/test';

test('Jane comparison exposes corrected facts and working attributed mobile store links', async ({ page, request }) => {
  const route = '/grow-guides/grow-with-jane-vs-mastergrowbot';
  const response = await request.get(route);
  expect(response.status()).toBe(200);
  const html = await response.text();
  expect(html).toContain('Grow with Jane now offers Jane AI');
  expect(html.match(/rel="canonical"/g)).toHaveLength(1);
  expect(html).toContain(`href="https://www.mastergrowbot.com${route}"`);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(route);
  await expect(page.locator('article')).toContainText('MasterGrowbot publishes this comparison');
  await expect(page.locator('article')).not.toContainText('After running parallel tests');
  await expect(page.locator('article')).not.toContainText('However, it lacks AI analysis capabilities');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const link = page.locator('article a[href*="play.google.com"]').last();
  const url = new URL((await link.getAttribute('href'))!);
  expect(url.searchParams.get('id')).toBe('com.mastergrowbot.app');
  await page.evaluate(() => {
    const capture = window as unknown as { __storeEvents: unknown[][] };
    capture.__storeEvents = [];
    window.gtag = (...args: unknown[]) => capture.__storeEvents.push(args);
    document.addEventListener('click', event => event.preventDefault(), true);
  });
  await link.click();
  const events = await page.evaluate(() => (window as unknown as { __storeEvents: unknown[][] }).__storeEvents.filter(e => e[1] === 'android_app_click'));
  expect(events).toHaveLength(1);
  expect(events[0][2]).toEqual(expect.objectContaining({ article_slug: 'grow-with-jane-vs-mastergrowbot', cta_location: expect.any(String) }));
});

