const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const base = process.env.HERO_BASE_URL || 'http://127.0.0.1:8097';

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.HERO_CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  const runs = [];
  try {
    for (let run = 0; run < 3; run++) {
      const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true });
      const page = await context.newPage();
      const cdp = await context.newCDPSession(page);
      await cdp.send('Network.enable');
      await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
      await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 200 * 1024, uploadThroughput: 93.75 * 1024 });
      await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
      await page.addInitScript(() => {
        window.heroPerformance = { lcp: 0, cls: 0, lcpElement: '', sessionValue: 0, sessionStart: 0, lastShift: 0 };
        new PerformanceObserver(list => {
          const entry = list.getEntries().at(-1);
          window.heroPerformance.lcp = entry.startTime;
          window.heroPerformance.lcpElement = entry.element?.id || entry.element?.className || entry.element?.tagName || '';
          window.heroPerformance.lcpUrl = entry.url || '';
        }).observe({ type: 'largest-contentful-paint', buffered: true });
        new PerformanceObserver(list => {
          for (const entry of list.getEntries()) {
            if (entry.hadRecentInput) continue;
            const stats = window.heroPerformance;
            if (entry.startTime - stats.lastShift > 1000 || entry.startTime - stats.sessionStart > 5000) {
              stats.sessionStart = entry.startTime;
              stats.sessionValue = 0;
            }
            stats.sessionValue += entry.value;
            stats.lastShift = entry.startTime;
            stats.cls = Math.max(stats.cls, stats.sessionValue);
          }
        }).observe({ type: 'layout-shift', buffered: true });
      });
      await page.goto(base + '/?mgb_analytics=off', { waitUntil: 'load' });
      await page.waitForTimeout(5000);
      const stats = await page.evaluate(() => ({
        lcpMs: Math.round(window.heroPerformance.lcp),
        cls: Number(window.heroPerformance.cls.toFixed(4)),
        lcpElement: window.heroPerformance.lcpElement,
        lcpUrl: window.heroPerformance.lcpUrl,
        heroImageBytes: performance.getEntriesByType('resource').filter(entry => /hero-(grow-lab|leaf-accent).*v8/.test(entry.name)).reduce((sum, entry) => sum + entry.encodedBodySize, 0),
        narratedVideoRequests: performance.getEntriesByType('resource').filter(entry => /narrated.*\.mp4/.test(entry.name)).length,
      }));
      runs.push(stats);
      console.log(JSON.stringify({ run: run + 1, ...stats }));
      await context.close();
    }
    const median = key => [...runs].map(run => run[key]).sort((a, b) => a - b)[1];
    const report = {
      conditions: { base, viewport: '390x844', deviceScaleFactor: 2, cpuSlowdown: 4, network: '1.64 Mbps down / 0.77 Mbps up, 150 ms latency', cache: 'Disabled; fresh context each run', analytics: 'Suppressed', mode: 'Production build served by Vite preview; synthetic local results, not field data' },
      runs,
      median: { lcpMs: median('lcpMs'), cls: median('cls') },
      targets: { lcpMs: 2500, cls: 0.1, heroImageBytes: 350000 },
    };
    fs.mkdirSync('output/playwright/hero-v8', { recursive: true });
    fs.writeFileSync(path.resolve('output/playwright/hero-v8/performance.json'), JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report, null, 2));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
