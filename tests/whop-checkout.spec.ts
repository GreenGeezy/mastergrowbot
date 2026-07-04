import { expect, type Locator, type Page, type Request, test } from "playwright/test";

const gaMeasurementId = process.env.GA4_MEASUREMENT_ID || "G-NT1046S3EN";

type CheckoutTarget = {
  label: string;
  pagePath: string;
  selector: string;
};

const growTechTargets: CheckoutTarget[] = [
  {
    label: "Scout Camera",
    pagePath: "/grow-tech",
    selector: 'button[data-cta-location="growtech_product_card:growtech_scout_camera_10_20x"]',
  },
  {
    label: "Environment Monitor",
    pagePath: "/grow-tech",
    selector: 'button[data-cta-location="growtech_product_card:growtech_environment_monitor"]',
  },
  {
    label: "Soil Health Meter",
    pagePath: "/grow-tech",
    selector: 'button[data-cta-location="growtech_product_card:growtech_soil_health_meter_6_in_1"]',
  },
  {
    label: "Grow Tech Kit",
    pagePath: "/grow-tech",
    selector: 'button[data-cta-location="growtech_bundle_section:bundle"]',
  },
];

const aiStrategyTargets: CheckoutTarget[] = [
  {
    label: "AI Strategy opportunity",
    pagePath: "/ai-strategy",
    selector: 'button[data-cta-location="ai_strategy_hero:opportunity"]',
  },
  {
    label: "AI Strategy agent buildout",
    pagePath: "/ai-strategy",
    selector: 'button[data-cta-location="ai_strategy_hero:agent"]',
  },
];

function isGaCollectRequest(request: Request) {
  const url = request.url();
  return url.includes("google-analytics.com") && url.includes("/collect");
}

async function getDataLayerEvents(page: Page) {
  return page.evaluate(() => {
    const dataLayer = window.dataLayer;

    if (!Array.isArray(dataLayer)) {
      return [];
    }

    return dataLayer
      .map((entry) => {
        if (Array.isArray(entry)) {
          return entry[1];
        }

        if (entry && typeof entry === "object" && "event" in entry) {
          return (entry as { event?: unknown }).event;
        }

        return undefined;
      })
      .filter(Boolean);
  });
}

async function expectCheckoutOpened(page: Page) {
  const whopFrame = page.locator('iframe[src*="whop.com"], iframe[title*="whop" i]').first();
  const whopUrl = /https:\/\/([^/]+\.)?whop\.com\//;

  await expect
    .poll(
      async () => {
        if (whopUrl.test(page.url())) {
          return true;
        }

        if ((await whopFrame.count()) > 0 && (await whopFrame.isVisible().catch(() => false))) {
          return true;
        }

        return false;
      },
      { message: "Whop checkout opened", timeout: 45_000 },
    )
    .toBe(true);
}

async function clickCheckout(page: Page, target: CheckoutTarget) {
  const button = page.locator(target.selector).first();
  await expect(button, `${target.label} checkout button exists`).toBeVisible({ timeout: 20_000 });

  const gaRequestPromise = page.waitForRequest(isGaCollectRequest, { timeout: 6_000 }).catch(() => null);
  await button.scrollIntoViewIfNeeded();
  await button.click();

  await expectCheckoutOpened(page);

  const events = await getDataLayerEvents(page);
  const gaRequest = await gaRequestPromise;
  const gaPayload = gaRequest ? `${gaRequest.url()} ${gaRequest.postData() || ""}` : "";

  if (events.length > 0) {
    expect(events).toContain("begin_checkout");
  }

  if (gaPayload) {
    expect(gaPayload).toContain(gaMeasurementId);
  }
}

test.describe("Whop checkout validation without paid transactions", () => {
  test("/grow-tech loads", async ({ page }) => {
    await page.goto("/grow-tech", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("heading", { name: /Grow Tech for Better Plant Data/i })).toBeVisible();
  });

  test("GrowTech product checkout buttons exist", async ({ page }) => {
    await page.goto("/grow-tech", { waitUntil: "domcontentloaded" });

    for (const target of growTechTargets) {
      await expect(page.locator(target.selector).first(), `${target.label} button`).toBeVisible();
    }
  });

  for (const target of growTechTargets) {
    test(`Clicking ${target.label} opens Whop checkout`, async ({ page }) => {
      await page.goto(target.pagePath, { waitUntil: "domcontentloaded" });

      await clickCheckout(page, target);
    });
  }

  test("/grow-tech/thank-you?status=success shows success copy", async ({ page }) => {
    await page.goto("/grow-tech/thank-you?status=success", { waitUntil: "domcontentloaded" });

    await expect(page.getByText("Order received. Please check your email for your Whop receipt and tracking updates.")).toBeVisible();
  });

  test("/grow-tech/thank-you?status=error shows retry and support copy", async ({ page }) => {
    await page.goto("/grow-tech/thank-you?status=error", { waitUntil: "domcontentloaded" });

    await expect(page.getByText(/Checkout was not completed\. Please return to GrowTech and try again or email/i)).toBeVisible();
    await expect(page.getByRole("link", { name: "support@mastergrowbot.com" })).toBeVisible();
  });

  test("/ai-strategy loads", async ({ page }) => {
    await page.goto("/ai-strategy", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("heading", { name: /Turn Cannabis AI Into Profit/i })).toBeVisible();
  });

  test("AI Strategy checkout CTAs exist", async ({ page }) => {
    await page.goto("/ai-strategy", { waitUntil: "domcontentloaded" });

    for (const target of aiStrategyTargets) {
      await expect(page.locator(target.selector).first(), `${target.label} button`).toBeVisible();
    }
  });

  for (const target of aiStrategyTargets) {
    test(`Clicking ${target.label} opens Whop checkout`, async ({ page }) => {
      await page.goto(target.pagePath, { waitUntil: "domcontentloaded" });

      await clickCheckout(page, target);
    });
  }

  test("/ai-strategy/intake?status=success shows checkout received copy", async ({ page }) => {
    await page.goto("/ai-strategy/intake?status=success", { waitUntil: "domcontentloaded" });

    await expect(page.getByText("Checkout received. Please complete the intake form below or schedule your call now.")).toBeVisible();
  });

  test("/ai-strategy/intake?status=error shows retry and support copy", async ({ page }) => {
    await page.goto("/ai-strategy/intake?status=error", { waitUntil: "domcontentloaded" });

    await expect(page.getByText("Checkout was not completed. Please return to AI Strategy and try again or email support@mastergrowbot.com.")).toBeVisible();
  });
});
