import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { createServer } from "vite";
import { chromium } from "playwright";
const output = process.env.REVIEW_OUTPUT || "output/premium-review";
await mkdir(output, { recursive: true });
const server = await createServer({
  server: { host: "127.0.0.1", port: 8080 },
});
await server.listen();
const browser = await chromium.launch({
  executablePath: process.env.BROWSER_EXECUTABLE_PATH || undefined,
  headless: true,
  args: [
    "--no-sandbox",
    "--disable-dev-shm-usage",
    "--use-gl=angle",
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader",
  ],
});
const errors = [];
try {
  const page = await browser.newPage();
  page.on("pageerror", (e) => errors.push(e.message));
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 950 });
    for (const route of ["", "grow-tech"]) {
      await page.goto(`http://127.0.0.1:8080/${route}`);
      await page.locator("h1").waitFor();
      await page.evaluate(() => document.fonts.ready);
      assert.equal(await page.locator("h1").count(), 1);
      assert(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `${route} overflows at ${width}`,
      );
      assert.equal(await page.locator("vite-error-overlay").count(), 0);
      await page.screenshot({
        path: `${output}/${route || "home"}-${width}.png`,
      });
      if (!route) {
        const group = page.getByRole("group", { name: "Explore app features" });
        for (const label of [
          "Plant health",
          "Strain library",
          "Strain intelligence",
          "Photo analysis",
        ]) {
          const button = group.getByRole("button", {
            name: label,
            exact: true,
          });
          await button.click();
          assert.equal(await button.getAttribute("aria-pressed"), "true");
        }
        assert.match(
          await page
            .locator('[data-cta-location="hero:ios"]')
            .getAttribute("href"),
          /apps.apple.com/,
        );
        assert.match(
          await page
            .locator('[data-cta-location="hero:android"]')
            .getAttribute("href"),
          /play.google.com/,
        );
        await page.getByText("Is there a free trial?", { exact: true }).click();
        assert(
          await page
            .locator("details[open]")
            .innerText()
            .then((t) => t.includes("Premium does not include")),
        );
      } else {
        for (const label of ["Environment", "Soil Meter", "Scout Camera"]) {
          const button = page
            .getByRole("group", { name: "Explore the three kit tools" })
            .getByRole("button", { name: label });
          await button.click();
          assert.equal(await button.getAttribute("aria-pressed"), "true");
        }
        assert.equal(await page.locator("[data-review-group]").count(), 3);
        assert.equal(
          await page.locator("[data-review-group] [data-review-id]").count(),
          12,
        );
        assert.equal(
          await page
            .locator('[data-cta-location="growtech_hero:bundle"]')
            .count(),
          1,
          "Configure public Whop env vars before checking purchase routes",
        );
        if (width === 390) {
          await page.locator("#products").scrollIntoViewIfNeeded();
          await page
            .getByRole("region", { name: "Complete kit purchase" })
            .waitFor();
        }
      }
      if (width < 1024) {
        await page
          .getByRole("button", { name: "Open navigation menu" })
          .click();
        await page
          .getByRole("button", { name: "Close navigation menu" })
          .click();
      }
      console.log(`PASS ${route || "home"} at ${width}px`);
    }
  }
  for (const slug of [
    "scout-camera",
    "environment-monitor",
    "soil-health-meter",
    "grow-tech-kit",
  ]) {
    await page.goto("http://127.0.0.1:8080/grow-tech");
    await page
      .locator(`#${slug} a[href="/grow-tech/checkout/${slug}"]`)
      .first()
      .click();
    await page.getByRole("heading", { name: "Complete your order" }).waitFor();
    assert(page.url().endsWith(`/grow-tech/checkout/${slug}`));
    await page.locator(".whop-embedded-checkout-host").waitFor();
    console.log(`PASS checkout navigation and embed host: ${slug}`);
  }
  assert.deepEqual(errors, []);
  console.log("PASS: no runtime errors. Payment submission was not attempted.");
} finally {
  await browser.close();
  await server.close();
}
