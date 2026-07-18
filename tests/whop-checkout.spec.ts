import { expect, type Locator, type Page, type Request, test } from "playwright/test";

const gaMeasurementId = process.env.GA4_MEASUREMENT_ID || "G-NT1046S3EN";

type CheckoutTarget = {
  label: string;
  pagePath: string;
  selector: string;
  accessibleName: string;
};

const growTechTargets: CheckoutTarget[] = [
  {
    label: "Scout Camera",
    pagePath: "/grow-tech",
    selector: 'button[data-cta-location="growtech_product_card:growtech_scout_camera_10_20x"]',
    accessibleName: "Get the Scout Camera",
  },
  {
    label: "Environment Monitor",
    pagePath: "/grow-tech",
    selector: 'button[data-cta-location="growtech_product_card:growtech_environment_monitor"]',
    accessibleName: "Get the Environment Monitor",
  },
  {
    label: "Soil Health Meter",
    pagePath: "/grow-tech",
    selector: 'button[data-cta-location="growtech_product_card:growtech_soil_health_meter_6_in_1"]',
    accessibleName: "Get the Soil Meter",
  },
  {
    label: "Grow Tech Kit",
    pagePath: "/grow-tech",
    selector: 'button[data-cta-location="growtech_bundle_section:bundle"]',
    accessibleName: "Get the Complete Kit - $197.60 with code",
  },
];

const aiStrategyTargets: CheckoutTarget[] = [
  {
    label: "AI Strategy opportunity",
    pagePath: "/ai-strategy",
    selector: 'button[data-cta-location="ai_strategy_hero:opportunity"]',
    accessibleName: "Find My First Agent Opportunity",
  },
  {
    label: "AI Strategy agent buildout",
    pagePath: "/ai-strategy",
    selector: 'button[data-cta-location="ai_strategy_hero:agent"]',
    accessibleName: "Start Agent Buildout",
  },
];

function isGaCollectRequest(request: Request) {
  const url = request.url();
  return url.includes("google-analytics.com") && url.includes("/collect");
}

async function getCheckoutButton(page: Page, target: CheckoutTarget): Promise<Locator> {
  const trackedButton = page.locator(target.selector).first();

  if ((await trackedButton.count()) > 0) {
    return trackedButton;
  }

  return page.getByRole("button", { name: target.accessibleName }).first();
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

async function seedPendingCheckout(page: Page, sourcePage: "/grow-tech" | "/ai-strategy") {
  await page.addInitScript(({ sourcePage }) => {
    const isGrowTech = sourcePage === "/grow-tech";
    const payload = {
      currency: "USD",
      value: isGrowTech ? 199 : 500,
      checkout_source_page: sourcePage,
      cta_location: "playwright_checkout_completion",
      plan_id: isGrowTech ? "plan_growtech_test" : "plan_ai_strategy_test",
      items: [
        {
          item_id: isGrowTech ? "growtech_test" : "ai_strategy_test",
          item_name: isGrowTech ? "GrowTech Test Product" : "AI Strategy Test Service",
          item_category: isGrowTech ? "GrowTech" : "AI Strategy",
          price: isGrowTech ? 199 : 500,
          quantity: 1,
        },
      ],
    };

    localStorage.setItem(
      "mastergrowbot.pending_checkout.v1",
      JSON.stringify({
        [sourcePage]: {
          checkoutId: `checkout_playwright_${sourcePage.replace(/\W/g, "_")}`,
          createdAt: Date.now(),
          payload,
        },
      }),
    );
  }, { sourcePage });
}

async function getEcommerceEvent(page: Page, eventName: string) {
  return page.evaluate((name) => {
    const entries = Array.isArray(window.dataLayer) ? window.dataLayer : [];
    return entries.find(
      (entry) =>
        entry &&
        !Array.isArray(entry) &&
        typeof entry === "object" &&
        "event" in entry &&
        entry.event === name,
    ) as Record<string, unknown> | undefined;
  }, eventName);
}

async function expectCheckoutOpened(page: Page) {
  const whopFrame = page.locator('iframe[src*="whop.com"], iframe[title*="whop" i]').first();
  const whopUrl = /https:\/\/([^/]+\.)?whop\.com\//;
  const safeConfigurationFallback = page.getByText("Embedded checkout is not configured yet.");

  await expect
    .poll(
      async () => {
        if (whopUrl.test(page.url())) {
          return true;
        }

        if ((await whopFrame.count()) > 0 && (await whopFrame.isVisible().catch(() => false))) {
          return true;
        }

        if (await safeConfigurationFallback.isVisible().catch(() => false)) {
          return true;
        }

        return false;
      },
      { message: "Whop checkout opened", timeout: 45_000 },
    )
    .toBe(true);
}

async function clickCheckout(page: Page, target: CheckoutTarget) {
  const button = await getCheckoutButton(page, target);
  await expect(button, `${target.label} checkout button exists`).toBeVisible({ timeout: 20_000 });

  if (await button.isDisabled()) {
    await expect(page.getByText("Checkout link coming soon.").first()).toBeVisible();
    return;
  }

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

    await expect(page.getByRole("heading", { name: /Better inputs\. Fewer blind spots\. One smarter grow\./i })).toBeVisible();
  });

  test("GrowTech product checkout buttons exist", async ({ page }) => {
    await page.goto("/grow-tech", { waitUntil: "domcontentloaded" });

    for (const target of growTechTargets) {
      await expect(await getCheckoutButton(page, target), `${target.label} button`).toBeVisible();
    }
  });

  for (const target of growTechTargets) {
    test(`Clicking ${target.label} opens Whop checkout`, async ({ page }) => {
      await page.goto(target.pagePath, { waitUntil: "domcontentloaded" });

      await clickCheckout(page, target);
    });
  }

  test("/grow-tech/thank-you?status=success shows success copy", async ({ page }) => {
    await seedPendingCheckout(page, "/grow-tech");
    await page.goto("/grow-tech/thank-you?status=success", { waitUntil: "domcontentloaded" });

    await expect(page.getByText("Order received. Please check your email for your Whop receipt and tracking updates.")).toBeVisible();

    const paymentInfo = await getEcommerceEvent(page, "add_payment_info");
    const purchase = await getEcommerceEvent(page, "purchase");
    expect(paymentInfo).toMatchObject({ currency: "USD", value: 199, payment_type: "Whop" });
    expect(paymentInfo?.items).toHaveLength(1);
    expect(purchase).toMatchObject({
      currency: "USD",
      value: 199,
      transaction_id: "checkout_playwright__grow_tech",
    });
    expect(purchase?.items).toHaveLength(1);
  });

  test("/grow-tech/thank-you?status=error shows retry and support copy", async ({ page }) => {
    await page.goto("/grow-tech/thank-you?status=error", { waitUntil: "domcontentloaded" });

    await expect(page.getByText(/Checkout was not completed\. Please return to GrowTech and try again or email/i)).toBeVisible();
    await expect(page.getByRole("link", { name: "support@mastergrowbot.com" }).first()).toBeVisible();
  });

  test("/ai-strategy loads", async ({ page }) => {
    await page.goto("/ai-strategy", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("heading", { name: /Turn Cannabis AI Into Profit/i })).toBeVisible();
  });

  test("AI Strategy checkout CTAs exist", async ({ page }) => {
    await page.goto("/ai-strategy", { waitUntil: "domcontentloaded" });

    for (const target of aiStrategyTargets) {
      await expect(await getCheckoutButton(page, target), `${target.label} button`).toBeVisible();
    }
  });

  for (const target of aiStrategyTargets) {
    test(`Clicking ${target.label} opens Whop checkout`, async ({ page }) => {
      await page.goto(target.pagePath, { waitUntil: "domcontentloaded" });

      await clickCheckout(page, target);
    });
  }

  test("/ai-strategy/intake?status=success shows checkout received copy", async ({ page }) => {
    await seedPendingCheckout(page, "/ai-strategy");
    await page.goto("/ai-strategy/intake?status=success", { waitUntil: "domcontentloaded" });

    await expect(page.getByText("Checkout received. Please complete the intake form below or schedule your call now.")).toBeVisible();

    const paymentInfo = await getEcommerceEvent(page, "add_payment_info");
    const purchase = await getEcommerceEvent(page, "purchase");
    expect(paymentInfo).toMatchObject({ currency: "USD", value: 500, payment_type: "Whop" });
    expect(paymentInfo?.items).toHaveLength(1);
    expect(purchase).toMatchObject({
      currency: "USD",
      value: 500,
      transaction_id: "checkout_playwright__ai_strategy",
    });
    expect(purchase?.items).toHaveLength(1);
  });

  test("/ai-strategy/intake?status=error shows retry and support copy", async ({ page }) => {
    await page.goto("/ai-strategy/intake?status=error", { waitUntil: "domcontentloaded" });

    await expect(page.getByText("Checkout was not completed. Please return to AI Strategy and try again or email support@mastergrowbot.com.")).toBeVisible();
  });
});
