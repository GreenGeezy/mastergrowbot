import { readFileSync } from "node:fs";
import { expect, test } from "playwright/test";
import {
  GROWTECH_PRODUCT_IDS,
  featuredGrowTechReviewIds,
  getGrowTechReviewSchema,
  getGrowTechReviews,
  growTechTestimonials,
} from "../src/data/growTechTestimonials";

const recoveredReviewIds = [
  "scout-jessica-s",
  "scout-chris-m",
  "scout-dave-a",
  "scout-alex-r",
  "environment-jake-l",
  "environment-karen-t",
  "soil-matt-m",
  "soil-richard-d",
  "soil-christopher-b",
  "soil-derek-g",
];

const expectedCounts = {
  [GROWTECH_PRODUCT_IDS.scoutCamera]: 5,
  [GROWTECH_PRODUCT_IDS.environmentMonitor]: 3,
  [GROWTECH_PRODUCT_IDS.soilHealthMeter]: 4,
};

test.describe("GrowTech testimonial data integrity", () => {
  test("preserves every recovered review and adds Mike P. and Rachel L. exactly once", () => {
    const ids = growTechTestimonials.map((review) => review.id);
    expect(new Set(ids).size).toBe(ids.length);

    for (const recoveredId of recoveredReviewIds) {
      expect(ids).toContain(recoveredId);
    }

    const mike = growTechTestimonials.filter((review) => review.id === "scout-mike-p");
    const rachel = growTechTestimonials.filter((review) => review.id === "environment-rachel-l");
    expect(mike).toHaveLength(1);
    expect(rachel).toHaveLength(1);
    expect(mike[0]).toMatchObject({
      reviewer: "Mike P.",
      productId: GROWTECH_PRODUCT_IDS.scoutCamera,
      rating: 5,
    });
    expect(rachel[0]).toMatchObject({
      reviewer: "Rachel L.",
      productId: GROWTECH_PRODUCT_IDS.environmentMonitor,
      rating: 5,
    });
  });

  test("uses valid product associations, authoritative counts, and valid featured review IDs", () => {
    const validProductIds = new Set(Object.values(GROWTECH_PRODUCT_IDS));

    for (const review of growTechTestimonials) {
      expect(validProductIds.has(review.productId)).toBe(true);
    }

    for (const [productId, expectedCount] of Object.entries(expectedCounts)) {
      const reviews = getGrowTechReviews(productId as keyof typeof expectedCounts);
      expect(reviews).toHaveLength(expectedCount);

      const featuredId = featuredGrowTechReviewIds[productId as keyof typeof featuredGrowTechReviewIds];
      const featuredReview = growTechTestimonials.find((review) => review.id === featuredId);
      expect(featuredReview).toBeTruthy();
      expect(featuredReview?.productId).toBe(productId);
    }

    expect(getGrowTechReviews(GROWTECH_PRODUCT_IDS.soilHealthMeter).some((review) => review.id === "soil-richard-d")).toBe(true);
  });

  test("keeps structured review data associated with the same authoritative records", () => {
    for (const productId of Object.values(GROWTECH_PRODUCT_IDS)) {
      const reviews = getGrowTechReviews(productId);
      const schemaReviews = getGrowTechReviewSchema(productId);
      expect(schemaReviews).toHaveLength(reviews.length);
      expect(schemaReviews.map((review) => review.reviewBody)).toEqual(reviews.map((review) => review.quote));

      reviews.forEach((review, index) => {
        if (review.rating === null) {
          expect(schemaReviews[index]).not.toHaveProperty("reviewRating");
        } else {
          expect(schemaReviews[index].reviewRating?.ratingValue).toBe(review.rating);
        }
      });
    }
  });

  test("keeps all four existing checkout environment keys unchanged", () => {
    const pageSource = readFileSync("src/pages/GrowTech.tsx", "utf8");
    [
      "NEXT_PUBLIC_WHOP_SCOUT_CAMERA_PLAN_ID",
      "NEXT_PUBLIC_WHOP_ENVIRONMENT_MONITOR_PLAN_ID",
      "NEXT_PUBLIC_WHOP_SOIL_HEALTH_METER_PLAN_ID",
      "NEXT_PUBLIC_WHOP_GROW_TECH_KIT_PLAN_ID",
    ].forEach((planKey) => expect(pageSource).toContain(planKey));
  });
});

test.describe("GrowTech testimonial rendering", () => {
  test("renders every product group, authoritative count, featured card review, and schema association", async ({ page }) => {
    await page.goto("/grow-tech");

    for (const [productId, expectedCount] of Object.entries(expectedCounts)) {
      const group = page.locator(`[data-review-group="${productId}"]`);
      await expect(group).toBeVisible();
      await expect(group.getByText(`${expectedCount} customer reviews`, { exact: true })).toBeVisible();
      await expect(group.locator("[data-review-id]")).toHaveCount(expectedCount);

      const featuredId = featuredGrowTechReviewIds[productId as keyof typeof featuredGrowTechReviewIds];
      await expect(page.locator(`[data-review-id="${featuredId}"]`).first()).toBeVisible();
    }

    for (const review of growTechTestimonials) {
      await expect(page.locator(`[data-review-group="${review.productId}"] [data-review-id="${review.id}"]`)).toHaveCount(1);
    }

    const jsonLdScripts = await page.locator('script[type="application/ld+json"]').allTextContents();
    const graph = jsonLdScripts
      .map((text) => JSON.parse(text))
      .find((value) => Array.isArray(value?.["@graph"]))?.["@graph"];
    expect(graph).toBeTruthy();

    for (const productId of Object.values(GROWTECH_PRODUCT_IDS)) {
      const productName = getGrowTechReviews(productId)[0].productName;
      const productSchema = graph.find((entry: { "@type"?: string; name?: string }) => entry["@type"] === "Product" && entry.name === productName);
      expect(productSchema.review).toHaveLength(expectedCounts[productId]);
      expect(productSchema.review.map((review: { reviewBody: string }) => review.reviewBody)).toEqual(
        getGrowTechReviews(productId).map((review) => review.quote),
      );
    }
  });
});
