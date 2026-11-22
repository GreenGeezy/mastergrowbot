import { test, expect, type Page } from 'playwright/test';
import { readFileSync } from 'node:fs';

// Placement rule (Nov 22, 2026): the homepage carries one understated newsletter band after all sales
// content; Grow Guides and GrowTech editorial pages may invite readers after the content; calculators,
// the symptom checker, checkout and thank-you pages carry no newsletter or lead-magnet promotion.
const promo = 'a[href*="/newsletter"], a[href*="cannabis-grow-calendar"], a[href*="home-grow-journal"], a[href*="cannabis-ai-at-work"], input[type=email]';
const sizes = [{ name: 'phone', viewport: { width: 375, height: 812 } }, { name: 'desktop', viewport: { width: 1366, height: 900 } }];

async function settle(page: Page, path: string) {
  await page.goto(path);
  await page.waitForLoadState('networkidle');
}

for (const size of sizes) {
  test.describe(`placements on ${size.name}`, () => {
    test.use({ viewport: size.viewport });

    test('homepage has exactly one newsletter placement, after the final sales section', async ({ page }) => {
      await settle(page, '/');
      await expect(page.locator('#weekly-newsletter')).toHaveCount(1);
      const order = await page.locator('main > *').evaluateAll(els => els.map(e => e.id));
      expect(order[order.length - 1]).toBe('weekly-newsletter');
      expect(order.indexOf('ipm-playbook')).toBe(order.length - 2);
      expect(await page.locator(`main ${promo.split(', ').join(', main ')}`).count()).toBe(2); // the band's email field and its one tool link
      expect(await page.locator('#weekly-newsletter').locator(promo).count()).toBe(2);
      expect(await page.locator('footer').locator(promo).count()).toBe(0);
      expect(await page.locator('nav').locator(promo).count()).toBe(0);
      if (size.name === 'phone') {
        await page.getByRole('button', { name: 'Open navigation menu' }).click();
        expect(await page.locator('nav').locator(promo).count()).toBe(0);
        await expect(page.locator('nav')).toContainText('VPD Calculator');
      }
    });

    for (const path of ['/cannabis-symptom-checker', '/vpd-calculator', '/grow-light-calculator', '/grow-tech', '/playbooks', '/about', '/grow-tech/thank-you']) {
      test(`${path} carries no newsletter or lead-magnet promotion`, async ({ page }) => {
        await settle(page, path);
        expect(await page.locator(promo).count()).toBe(0);
      });
    }

    for (const [path, content] of [['/grow-guides', 'hub'], ['/grow-guides/cannabis-nutrient-deficiency-guide', 'cannabis-nutrient-deficiency-guide'], ['/grow-tech/apexel-macro-lens-kit', 'lens_kit']]) {
      test(`${path} invites readers to Grow Week once, after the content`, async ({ page }) => {
        await settle(page, path);
        const invite = page.locator('a[href*="cannabis-grow-calendar"]');
        await expect(invite).toHaveCount(1);
        await expect(invite).toHaveAttribute('href', new RegExp(`utm_campaign=grow_week&utm_content=${content}$`));
        expect(await page.locator('input[type=email], a[href*="/newsletter"]').count()).toBe(0);
      });
    }
  });
}

test.describe('Grow Week tool', () => {
  test.use({ viewport: { width: 375, height: 812 }, reducedMotion: 'reduce' });

  test('first visit shows a labeled worked example before any email ask', async ({ page }) => {
    await settle(page, '/cannabis-grow-calendar');
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('.gw-tag-example')).toContainText('Fictional example');
    await expect(page.locator('.gw-now')).toContainText('Week 8');
    await expect(page.locator('.gw-flags')).toContainText('Humidity 64% is above the general 50 to 60% range');
    const resultTop = await page.locator('#result').evaluate(e => e.getBoundingClientRect().top);
    const formTop = await page.locator('#weekly').evaluate(e => e.getBoundingClientRect().top);
    expect(formTop).toBeGreaterThan(resultTop);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0);
  });

  test('incomplete input, keyboard entry, readings, save and return visit', async ({ page }) => {
    await settle(page, '/cannabis-grow-calendar');
    await page.getByRole('link', { name: 'Plan my grow' }).click();
    await expect(page.locator('.gw-empty')).toContainText('Add a sprout date');
    await page.keyboard.press('ArrowRight');
    await expect(page.locator('#gw-type-auto')).toBeChecked();
    await page.getByLabel('About how many weeks ago?').fill('7');
    await expect(page.locator('.gw-now')).toContainText('Week 8');
    await expect(page.locator('.gw-now')).toContainText('estimated start');
    await page.getByRole('button', { name: 'Add reading' }).click();
    await expect(page.locator('.gw-error')).toContainText('Add at least one reading');
    await page.getByLabel('RH %').fill('63');
    await page.getByLabel(/^Note/).fill('A'.repeat(400));
    await page.getByRole('button', { name: 'Add reading' }).click();
    await expect(page.locator('.gw-flags')).toContainText('Humidity 63% is above');
    await page.getByRole('button', { name: 'Save on this device' }).click();
    await expect(page.locator('.gw-status')).toContainText('Nothing was uploaded');
    await page.reload(); await page.waitForLoadState('networkidle');
    await expect(page.locator('.gw-welcome')).toContainText('Welcome back');
    await expect(page.locator('.gw-table tbody tr')).toHaveCount(1);
  });

  test('saved Home Grow Fieldnotes notes carry over', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('mgb.home-grow-fieldnotes.v1', JSON.stringify({ question: 'leaves', change: '', visits: [{ date: '2026-11-14', note: 'Pale tip on one lower leaf.', photo: '', humidity: '54' }, { date: '', note: '', photo: '', humidity: '' }] })));
    await settle(page, '/cannabis-grow-calendar');
    await expect(page.locator('.gw-welcome')).toContainText('brought over 1 note');
    await expect(page.locator('.gw-table')).toContainText('Pale tip on one lower leaf.');
  });

  test('calendar export works and notes never reach analytics or the network', async ({ page }) => {
    const bodies: string[] = [];
    page.on('request', r => { const b = r.postData(); if (b) bodies.push(r.url() + b); bodies.push(r.url()); });
    await settle(page, '/cannabis-grow-calendar');
    await page.getByRole('link', { name: 'Plan my grow' }).click();
    await page.getByLabel('Day it sprouted').fill('2026-10-04');
    await page.getByLabel(/switched the light to 12\/12/).fill('2026-11-08');
    await page.getByLabel(/^Note/).fill('PRIVATE-NOTE-MARKER');
    await page.getByLabel('Temp °F').fill('79');
    await page.getByRole('button', { name: 'Add reading' }).click();
    const download = page.waitForEvent('download');
    await page.getByRole('button', { name: /Weekly reminders/ }).click();
    const ics = readFileSync(await (await download).path(), 'utf8');
    expect(ics).toContain('BEGIN:VCALENDAR');
    expect(ics).toContain('SUMMARY:Start trichome checks');
    expect(ics).not.toContain('PRIVATE-NOTE-MARKER');
    const events = await page.evaluate(() => {
      const seen = new WeakSet();
      return JSON.stringify(window.dataLayer ?? [], (_k, v) => { if (v && typeof v === 'object') { if (seen.has(v) || v instanceof Node || v === window) return undefined; seen.add(v); } return v; });
    });
    expect(events).not.toContain('PRIVATE-NOTE-MARKER');
    expect(bodies.join('\n')).not.toContain('PRIVATE-NOTE-MARKER');
  });

  test('signup sends the placement and keeps the original referral through an internal hop', async ({ page }) => {
    let sent: Record<string, string> | null = null;
    await page.route('**/api/newsletter/subscribe', async route => { sent = route.request().postDataJSON(); await route.fulfill({ json: { ok: true, confirmationSent: true } }); });
    await settle(page, '/newsletter?utm_source=linkedin&utm_medium=social&utm_campaign=grow_week_demo&utm_content=post_1');
    await page.locator('a.nlp-tool').first().click();
    await page.waitForURL(/cannabis-grow-calendar/);
    expect(page.url()).toContain('utm_source=linkedin');
    await page.locator('#weekly').getByLabel('Email address').fill('owner-test@example.com');
    await page.locator('#weekly').getByRole('button', { name: /weekly email/ }).click();
    await expect(page.locator('.nls-done')).toContainText('confirm your email');
    expect(sent).toMatchObject({ sourceForm: 'newsletter_grow_week', utm_source: 'linkedin', utm_medium: 'social', utm_campaign: 'grow_week_demo', utm_content: 'post_1' });
  });

  test('old journal links land on the new tool with their tags', async ({ page }) => {
    await settle(page, '/home-grow-journal?utm_source=reader&utm_medium=referral&utm_campaign=home_fieldnotes');
    await expect(page).toHaveURL(/\/cannabis-grow-calendar\?utm_source=reader&utm_medium=referral&utm_campaign=home_fieldnotes$/);
  });
});

test('prerendered pages: tool is indexable and the homepage band is server-rendered once', () => {
  const tool = readFileSync('dist/seo/cannabis-grow-calendar.html', 'utf8');
  expect(tool.match(/rel="canonical"/g)).toHaveLength(1);
  expect(tool).toContain('Fictional example');
  expect(tool).not.toMatch(/ChatGPT|Claude|Gemini|OpenAI/);
  const home = readFileSync('dist/index.html', 'utf8');
  expect(home.match(/id="weekly-newsletter"/g)).toHaveLength(1);
  expect(home).not.toContain('home-grow-journal');
});
