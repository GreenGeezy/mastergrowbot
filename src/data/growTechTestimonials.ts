export const GROWTECH_PRODUCT_IDS = {
  scoutCamera: "growtech_scout_camera_10_20x",
  environmentMonitor: "growtech_environment_monitor",
  soilHealthMeter: "growtech_soil_health_meter_6_in_1",
} as const;

export type GrowTechProductId = (typeof GROWTECH_PRODUCT_IDS)[keyof typeof GROWTECH_PRODUCT_IDS];

export type GrowTechTestimonial = {
  id: string;
  productId: GrowTechProductId;
  productName: string;
  quote: string;
  reviewer: string;
  location: string;
  rating: number | null;
  source: string;
};

const PRE_REGRESSION_SOURCE = "9edf53e^:src/pages/GrowTech.tsx";
const USER_SUPPLIED_SOURCE = "GrowTech testimonial repair brief, July 18, 2026";

export const growTechTestimonials: GrowTechTestimonial[] = [
  {
    id: "scout-jessica-s",
    productId: GROWTECH_PRODUCT_IDS.scoutCamera,
    productName: "MasterGrowbot AI Scout Camera 10-20X",
    quote: "I love the lens, it doesn't distort.",
    reviewer: "Jessica S.",
    location: "USA",
    rating: null,
    source: PRE_REGRESSION_SOURCE,
  },
  {
    id: "scout-chris-m",
    productId: GROWTECH_PRODUCT_IDS.scoutCamera,
    productName: "MasterGrowbot AI Scout Camera 10-20X",
    quote:
      "Amazing! Really good lenses. Fast shipping and free delivery. I always wanted to try macro-photography with my iPhone 14 Pro Max. Really recommend!",
    reviewer: "Chris M.",
    location: "USA",
    rating: null,
    source: PRE_REGRESSION_SOURCE,
  },
  {
    id: "scout-dave-a",
    productId: GROWTECH_PRODUCT_IDS.scoutCamera,
    productName: "MasterGrowbot AI Scout Camera 10-20X",
    quote: "Excellent results with the equipment.",
    reviewer: "Dave A.",
    location: "USA",
    rating: null,
    source: PRE_REGRESSION_SOURCE,
  },
  {
    id: "scout-alex-r",
    productId: GROWTECH_PRODUCT_IDS.scoutCamera,
    productName: "MasterGrowbot AI Scout Camera 10-20X",
    quote:
      "Very good quality. You just need to get used to it and learn how to use it with a Pixel 10, but the first impression is very good.",
    reviewer: "Alex R.",
    location: "USA",
    rating: null,
    source: PRE_REGRESSION_SOURCE,
  },
  {
    id: "scout-mike-p",
    productId: GROWTECH_PRODUCT_IDS.scoutCamera,
    productName: "MasterGrowbot AI Scout Camera 10-20X",
    quote:
      "Quality far superior to its price! The lens is quite heavy, which shows that it is of good quality, and the light works wonderfully to capture all the macro details.",
    reviewer: "Mike P.",
    location: "USA",
    rating: null,
    source: USER_SUPPLIED_SOURCE,
  },
  {
    id: "environment-jake-l",
    productId: GROWTECH_PRODUCT_IDS.environmentMonitor,
    productName: "MasterGrowbot AI Environment Monitor",
    quote: "Excellent analyzer. Convenient and functional.",
    reviewer: "Jake L.",
    location: "USA",
    rating: null,
    source: PRE_REGRESSION_SOURCE,
  },
  {
    id: "environment-karen-t",
    productId: GROWTECH_PRODUCT_IDS.environmentMonitor,
    productName: "MasterGrowbot AI Environment Monitor",
    quote:
      "Item arrived in sealed box, well padded, and in good condition. Comes with charging cable and manual. Unit looks well made and display is bright. Works as expected.",
    reviewer: "Karen T.",
    location: "Canada",
    rating: null,
    source: PRE_REGRESSION_SOURCE,
  },
  {
    id: "environment-rachel-l",
    productId: GROWTECH_PRODUCT_IDS.environmentMonitor,
    productName: "MasterGrowbot AI Environment Monitor",
    quote:
      "Works straight out of the box, one touch button to turn it on and your away, clear screen with good range of data available to check your air quality, if your unsure of any readings just google it and you can find out what range you should be in.",
    reviewer: "Rachel L.",
    location: "USA",
    rating: null,
    source: USER_SUPPLIED_SOURCE,
  },
  {
    id: "soil-matt-m",
    productId: GROWTECH_PRODUCT_IDS.soilHealthMeter,
    productName: "MasterGrowbot AI Soil Health Meter 6-in-1",
    quote:
      "Very valuable tool to have around for the serious grower. I use mine a lot. Very accurate. Uses 2 AAA batteries.",
    reviewer: "Matt M.",
    location: "USA",
    rating: null,
    source: PRE_REGRESSION_SOURCE,
  },
  {
    id: "soil-richard-d",
    productId: GROWTECH_PRODUCT_IDS.soilHealthMeter,
    productName: "MasterGrowbot AI Soil Health Meter 6-in-1",
    quote: "It works perfectly!",
    reviewer: "Richard D.",
    location: "USA",
    rating: null,
    source: PRE_REGRESSION_SOURCE,
  },
  {
    id: "soil-christopher-b",
    productId: GROWTECH_PRODUCT_IDS.soilHealthMeter,
    productName: "MasterGrowbot AI Soil Health Meter 6-in-1",
    quote:
      "Excellent multipurpose garden meter. Construction is robust. Just remember to never leave the probes in soil. The meter measures by using dissimilar metal in the probes to create a current in the soil. Clean probes every time after use or they will corrode; this is not a fault of the meter, but a function of physics.",
    reviewer: "Christopher B.",
    location: "USA",
    rating: null,
    source: PRE_REGRESSION_SOURCE,
  },
  {
    id: "soil-derek-g",
    productId: GROWTECH_PRODUCT_IDS.soilHealthMeter,
    productName: "MasterGrowbot AI Soil Health Meter 6-in-1",
    quote:
      "I bought this soil analyzer recently. It does exactly what it promises, which is great for those who don't know much about gardening. As a layperson, I still need to study a bit more about the other measurements. But at least I've managed to understand the pH of my soil, which was the most important thing for me. I think now my plants will have a better home!",
    reviewer: "Derek G.",
    location: "USA",
    rating: null,
    source: PRE_REGRESSION_SOURCE,
  },
];

export const featuredGrowTechReviewIds: Record<GrowTechProductId, string> = {
  [GROWTECH_PRODUCT_IDS.scoutCamera]: "scout-mike-p",
  [GROWTECH_PRODUCT_IDS.environmentMonitor]: "environment-rachel-l",
  [GROWTECH_PRODUCT_IDS.soilHealthMeter]: "soil-richard-d",
};

export const growTechReviewProductOrder: GrowTechProductId[] = [
  GROWTECH_PRODUCT_IDS.scoutCamera,
  GROWTECH_PRODUCT_IDS.environmentMonitor,
  GROWTECH_PRODUCT_IDS.soilHealthMeter,
];

export function getGrowTechReviews(productId: GrowTechProductId) {
  return growTechTestimonials.filter((review) => review.productId === productId);
}

export function getFeaturedGrowTechReview(productId: GrowTechProductId) {
  const featuredId = featuredGrowTechReviewIds[productId];
  return growTechTestimonials.find((review) => review.id === featuredId);
}

export function getGrowTechReviewSchema(productId: GrowTechProductId) {
  return getGrowTechReviews(productId).map((review) => ({
    "@type": "Review",
    "@id": `https://www.mastergrowbot.com/grow-tech#review-${review.id}`,
    reviewBody: review.quote,
    author: {
      "@type": "Person",
      name: review.reviewer,
    },
    ...(review.rating === null
      ? {}
      : {
          reviewRating: {
            "@type": "Rating",
            ratingValue: review.rating,
            bestRating: 5,
            worstRating: 1,
          },
        }),
  }));
}
