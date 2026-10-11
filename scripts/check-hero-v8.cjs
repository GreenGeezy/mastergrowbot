const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const base = process.env.HERO_BASE_URL || 'http://127.0.0.1:8096';
const output = path.resolve('output/playwright/hero-v8');
fs.mkdirSync(output, { recursive: true });

function trackingEntries(page, name) {
  return page.evaluate(name => window.dataLayer.filter(entry => entry[0] === 'event' && entry[1] === name).map(entry => entry[2]), name);
}

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.HERO_CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  const results = [];
  try {
    for (const width of [320, 360, 390, 430, 768, 899, 900, 1024, 1280, 1440]) {
      const context = await browser.newContext({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
      const page = await context.newPage();
      const errors = [];
      const videoRequests = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('request', request => { if (/narrated.*\.mp4/.test(request.url())) videoRequests.push(request.url()); });
      await page.goto(base + '/?mgb_analytics=on');
      await page.locator('#hero-title').waitFor();
      await page.waitForFunction(() => window.dataLayer.some(entry => entry[0] === 'event' && entry[1] === 'hero_exposure'));
      await page.evaluate(() => document.fonts.ready);
      const hero = page.locator('.revenue-hero');
      assert.equal((await page.locator('#hero-title').innerText()).replace(/\s+/g, ' ').trim(), 'Something look off? Get a second set of eyes.');
      assert.equal(await hero.locator('video').count(), 0, 'No hero video before interaction');
      assert.equal(videoRequests.length, 0, 'No narrated-video request before interaction');
      assert.equal(await trackingEntries(page, 'hero_exposure').then(events => events.length), 1);
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Page overflow at ${width}`);
      assert.equal(await hero.getByRole('button', { name: 'Report', exact: true }).getAttribute('aria-pressed'), 'true');
      assert.match(await hero.locator('.hero-example-report').innerText(), /Yellow lower leaves/);
      assert.match(await hero.locator('.hero-example-report').innerText(), /If yes, pause watering/);
      assert(await hero.locator('.hero-example-report').evaluate(el => el.scrollHeight <= el.clientHeight), `Beginner report fits without scrolling at ${width}`);
      const layout = await hero.evaluate(el => {
        const rect = selector => {
          const box = el.querySelector(selector).getBoundingClientRect();
          return { x: box.x, y: box.y, width: box.width, height: box.height, right: box.right, bottom: box.bottom };
        };
        return { copy: rect('.premium-hero-copy'), showcase: rect('.hero-showcase'), quote: rect('.hero-customer-quote'), phone: rect('.hero-demo-phone'), screen: rect('.hero-demo-screen'), cards: ['.hero-benefit-insight', '.hero-benefit-record'].map(rect), buttons: ['[data-cta-location="hero:ios"]', '[data-cta-location="hero:android"]'].map(rect) };
      });
      assert.equal(layout.buttons[0].width, layout.buttons[1].width, 'Equal platform button widths');
      assert.equal(layout.buttons[0].height, layout.buttons[1].height, 'Equal platform button heights');
      if (width < 900) {
        assert(layout.showcase.y >= layout.copy.bottom, `Showcase follows copy at ${width}`);
        assert(layout.quote.y >= layout.showcase.bottom, `Quote follows showcase at ${width}`);
      }
      for (const selector of ['.premium-actions a', '.hero-demo-top button', '.hero-demo-steps button', '.hero-workflow-link']) {
        for (const control of await hero.locator(selector).all()) assert((await control.boundingBox()).height >= 44, `${selector} target is at least 44px at ${width}`);
      }
      const overlap = (a, b) => Math.max(0, Math.min(a.right, b.right) - Math.max(a.x, b.x)) * Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.y, b.y));
      assert.equal(overlap(layout.cards[0], layout.cards[1]), 0, 'Benefit cards do not overlap');
      for (const card of layout.cards) assert.equal(overlap(card, layout.screen), 0, `Benefit cards do not obscure the report at ${width}`);
      assert.equal(await hero.locator('.hero-demo-screen').evaluate(el => getComputedStyle(el, '::after').display), 'none');
      assert.equal(await hero.locator('.hero-demo-phone').evaluate(el => getComputedStyle(el).animationName), 'none');
      const art = await hero.locator('.hero-lab-art img').evaluate(img => ({ complete: img.complete, width: img.naturalWidth, src: img.currentSrc }));
      assert(art.complete && art.width > 0, 'Backdrop loaded');
      assert.equal(art.src.includes('mobile'), width < 600, 'Responsive art selection');

      // Keep navigation local while exercising the actual delegated click handler.
      await page.evaluate(() => document.addEventListener('click', event => { if (event.target.closest('[data-hero-version]')) event.preventDefault(); }, true));
      for (const platform of ['ios', 'android']) {
        const link = hero.locator(`[data-cta-location="hero:${platform}"]`);
        const href = new URL(await link.getAttribute('href'));
        assert.equal(href.searchParams.get('utm_campaign'), 'hero');
        assert.equal(href.searchParams.get('utm_source'), 'website');
        assert.equal(href.searchParams.get('utm_medium'), 'organic');
        assert.equal(href.hostname, platform === 'ios' ? 'apps.apple.com' : 'play.google.com');
        await link.focus();
        assert.notEqual(await link.evaluate(el => getComputedStyle(el).outlineStyle), 'none');
        await page.keyboard.press('Enter');
        let events = await trackingEntries(page, `${platform}_app_click`);
        assert.equal(events.length, 1, 'One click event per keyboard activation');
        assert.equal(events[0].hero_version, 'grow_lab_v9');
        assert.equal(events[0].platform, platform);
        assert.equal(events[0].placement, 'homepage_hero');
        await link.locator('svg').first().click();
        events = await trackingEntries(page, `${platform}_app_click`);
        assert.equal(events.length, 2, 'One additional click event when clicking the platform icon');
      }

      for (const label of ['Photo', 'Journal', 'Report']) {
        const tab = hero.getByRole('button', { name: label, exact: true });
        await tab.focus();
        await page.keyboard.press('Enter');
        assert.equal(await tab.getAttribute('aria-pressed'), 'true');
        if (label !== 'Report') {
          await page.waitForFunction(() => { const image = document.querySelector('.hero-photo-experience>img, .hero-demo-screen img'); return image?.complete && image.naturalWidth > 0; });
        }
      }
      await hero.getByRole('button', { name: /Try photo/ }).click();
      const capture = hero.getByRole('button', { name: /Take example photo/ });
      assert((await capture.boundingBox()).height >= 44);
      await capture.focus();
      await page.keyboard.press('Enter');
      await hero.getByRole('status').waitFor();
      await hero.locator('.hero-example-report').waitFor();
      assert.equal(await hero.getByRole('button', { name: 'Report', exact: true }).getAttribute('aria-pressed'), 'true');
      assert.equal(await trackingEntries(page, 'hero_photo_demo_capture').then(events => events.length), 1);
      assert.equal(await trackingEntries(page, 'hero_photo_demo_complete').then(events => events.length), 1);
      if ([390,1440].includes(width)) {
        await hero.getByRole('button', { name: 'Photo', exact: true }).click();
        await hero.screenshot({ path: path.join(output, `hero-photo-${width}.png`) });
        await hero.getByRole('button', { name: /Take example photo/ }).click();
        await hero.getByRole('button', { name: 'Journal', exact: true }).click();
        await page.waitForTimeout(2600);
        assert.equal(await hero.getByRole('button', { name: 'Journal', exact: true }).getAttribute('aria-pressed'), 'true', 'Changing steps cancels the pending example');
        assert.equal(await trackingEntries(page, 'hero_photo_demo_complete').then(events => events.length), 1);
        await hero.getByRole('button', { name: 'Report', exact: true }).click();
      }
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.mouse.move(0, 0);
      await hero.getByRole('button', { name: 'Report', exact: true }).evaluate(el => el.blur());
      await page.screenshot({ path: path.join(output, `hero-${width}.png`) });
      if (width === 390 || width === 1440) await hero.screenshot({ path: path.join(output, `hero-section-${width}.png`) });

      let media;
      if ([390, 768, 1440].includes(width)) {
        const watch = hero.getByRole('button', { name: /Watch demo/ });
        await watch.focus();
        await page.keyboard.press('Enter');
        assert.equal(await hero.locator('.hero-benefit-card').count(), 0, 'Video is unobstructed');
        assert.equal(await hero.locator('.hero-lab-art').count(), 0, 'Artwork is removed for video');
        const video = hero.locator('video');
        await video.evaluate(async video => { video.muted = true; await video.play(); });
        await page.waitForFunction(() => document.querySelector('.hero-demo-video video')?.currentTime > 0.2);
        await page.waitForFunction(() => document.querySelector('.hero-demo-video track')?.readyState === 2);
        media = await video.evaluate(video => ({ duration: video.duration, source: video.currentSrc, controls: video.controls, captions: video.querySelector('track').readyState, error: video.error?.message }));
        assert(media.duration >= 35 && media.duration <= 45);
        assert(media.controls && !media.error && media.captions === 2);
        assert.equal(media.source.includes('wide-v7'), width >= 768);
        await video.evaluate(video => { video.pause(); video.currentTime = video.duration * .8; video.dispatchEvent(new Event('timeupdate')); video.dispatchEvent(new Event('timeupdate')); });
        for (const milestone of [25, 50, 75]) assert.equal(await trackingEntries(page, 'hero_video_progress').then(events => events.filter(event => event.milestone === milestone).length), 1, 'Deduplicated video milestone');
        await hero.getByRole('button', { name: 'Back to preview', exact: true }).click();
        assert.equal(await hero.locator('video').count(), 0);
        assert.equal(await hero.locator('.hero-example-report').count(), 1);
      }
      assert.equal(await trackingEntries(page, 'hero_exposure').then(events => events.length), 1, 'Interactions do not repeat exposure');
      assert.deepEqual(errors, [], 'No uncaught page errors');
      results.push({ width, layout: width < 900 ? 'stacked' : 'columns', horizontalOverflow: false, cardOverlap: false, heroExposureEvents: 1, singleEventPerClick: true, initialVideoRequests: 0, art: art.src.split('/').pop(), media });
      await context.close();
    }

    const failed = await browser.newPage({ viewport: { width: 390, height: 1000 } });
    await failed.route('**/images/premium/hero-*v8.webp', route => route.abort());
    await failed.route('**/images/premium/walkthrough-capture.webp', route => route.abort());
    await failed.goto(base + '/?mgb_analytics=off');
    await failed.locator('.hero-example-report').waitFor();
    await failed.getByRole('button', { name: 'Photo', exact: true }).click();
    await failed.locator('.hero-screen-fallback').waitFor();
    assert.match(await failed.locator('.hero-screen-fallback').innerText(), /Start with your plant/);
    assert.equal(await failed.evaluate(() => window.mgbAnalyticsSuppressed), true);
    assert.equal(await trackingEntries(failed, 'hero_exposure').then(events => events.length), 0);
    assert(await failed.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await failed.screenshot({ path: path.join(output, 'hero-image-fallback.png'), fullPage: false });
    results.push({ failedImages: 'Readable native report, gradient backdrop and photo fallback', qaSuppression: true });

    const motion = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'no-preference' });
    await motion.goto(base + '/?mgb_analytics=off');
    await motion.locator('.hero-demo-screen').waitFor();
    assert.equal(await motion.locator('.hero-demo-screen').evaluate(el => getComputedStyle(el, '::after').animationIterationCount), '1');
    assert.equal(await motion.locator('.hero-demo-phone').evaluate(el => getComputedStyle(el).animationIterationCount), '1');
    results.push({ motion: 'One entrance and scan sweep; reduced motion disables both' });
    fs.writeFileSync(path.join(output, 'verification.json'), JSON.stringify(results, null, 2));
    console.log(JSON.stringify(results, null, 2));
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
